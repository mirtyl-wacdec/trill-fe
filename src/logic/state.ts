import create, { State } from "zustand";
import { bootstrapApi } from "./api";
import produce from "immer";
import Urbit from "@urbit/http-api";
import type { Node, FullNode, ID, Ship, Graph } from "./types";
import { scryNodeFlat, scryNodeFull } from "./actions";
import { NullIcon } from "../ui/Icons";
interface FollowAttempt {
  ship: Ship;
  timestamp: number;
}

export type SubscriptionStatus = "connected" | "disconnected" | "reconnecting";

export interface LocalState {
  our: Ship;
  airlock: Urbit;
  theme: "light" | "dark" | "auto";
  dark: boolean;
  mobile: boolean;
  breaks: {
    sm: boolean;
    md: boolean;
    lg: boolean;
  };
  subscription: SubscriptionStatus;
  reconnect: () => Promise<void>;
  bootstrap: () => Promise<void>;
  errorCount: number;
  init: () => void;
  fans: Set<Ship>;
  follows: Set<Ship>;
  follow_attempts: FollowAttempt[];
  activeFeed: "timeline" | "notifications" | "not-follow" | "not-found" | Ship;
  activeGraph: Graph;
  activeThread: FullNode | null;
  lists: any[],
  scryFeed: (feed: string) => Promise<void>;
  scryThread: (host: Ship, id: ID) => Promise<void>;
  scryFollows: () => Promise<void>;
  scryLists: () => Promise<void>;
  subscribeFeed: () => Promise<void>;
  subscribeHark: () => Promise<void>;
  subscribeJoins: () => Promise<void>;
  policy: Policy;
  scryPolicy: () => Promise<void>;
  changePolicy: () => Promise<void>;
  scryTimeline: () => Promise<void>;
  preview: Ship;
  setPreview: (s: Ship) => void;
  replyTo: Node | null;
  quoteTo: Node | null;
  setReply: (n: Node | null) => void;
  setQuote: (n: Node | null) => void;
  highlighted: Node | null;
  resetHighlighted: () => void;
  reactingTo: Node | null;
  setReacting: (n: Node | null) => void;
}
interface Key {
  ship: Ship;
  name: string;
}
interface Policy {
  read: Whitelist | Blacklist;
  write: Whitelist | Blacklist;
}
interface Whitelist {
  allow: Ship[];
}
interface Blacklist {
  "not-allow": Ship[];
}
function wait(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
type LocalStateZus = LocalState & State;

const useLocalState = create<LocalStateZus>((set, get) => ({
  our: "~" + (window as any).ship,
  theme: "auto",
  fans: new Set([]),
  follows: new Set([]),
  lists: [],
  dark: false,
  mobile: false,
  breaks: {
    sm: false,
    md: false,
    lg: false,
  },
  subscription: "connected",
  errorCount: 0,
  // XX this logic should be handled by eventsource lib, but channel
  // resume doesn't work properly
  airlock: new Urbit("http://localhost"),
  init: () => {
    const airlock = bootstrapApi();

    set({ airlock: airlock, our: "~" + airlock.ship as string })
  },
  reconnect: async () => {
    const airlock = get().airlock;
    const { errorCount } = get();
    set((s) => ({
      errorCount: s.errorCount + 1,
      subscription: "reconnecting",
    }));

    if (errorCount > 5) {
      set({ subscription: "disconnected" });
      return;
    }
    await wait(Math.pow(2, errorCount) * 750);

    try {
      if (airlock) airlock.reset();
      await bootstrapApi();
    } catch (e) {
      console.error(`Retrying connection, attempt #${errorCount}`);
    }
  },
  bootstrap: async () => {
    const airlock = get().airlock;
    set({ subscription: "reconnecting", errorCount: 0 });
    if (airlock) airlock.reset();
    await bootstrapApi();
    set({ subscription: "connected" });
  },
  // @ts-ignore investigate zustand types
  activeFeed: (window as any).ship,
  activeGraph: {},
  activeThread: null,
  scryFeed: async (feed: Ship) => {
    const airlock = get().airlock;
    const path = `/feed/${feed}`;
    const res = await airlock.scry({ app: "feed-store", path: path });
    if ("feed-scry" in res)
      set({
        activeGraph: res["feed-scry"]["feed"],
        activeFeed: feed,
        highlighted: null
      });
    else if ("not-follow" in res)
      set({
        activeFeed: "not-follow",
        highlighted: null
      });
  },
  scryThread: async (host: Ship, id: ID) => {
    const res = await scryNodeFull(host, id);
    console.log(res, "scried thread")
    // TODO error handling 
    if ("full-node-scry" in res) {
      set({
        activeFeed: "thread",
        activeThread: res["full-node-scry"],
        highlighted: null
      })
    }
    else {

    }
  },
  scryTimeline: async () => {
    const airlock = get().airlock;
    const res = await airlock.scry({ app: "feed-store", path: "/timeline" });
    set({
      activeGraph: res.timeline.timeline,
      activeFeed: "timeline",
      highlighted: null
    });
  },
  scryFollows: async () => {
    const airlock = get().airlock;
    const res = await airlock.scry({ app: "feed-store", path: "/following" });
    // set({
    //   fans: res["feed-scry"]["follows"],
    //   follows: res["feed-scry"]["fans"],
    // });
    set({ follows: new Set(res["following"]) });
  },
  scryLists: async () => {
    const airlock = get().airlock;
    const res = await airlock.scry({ app: "list-store", path: "/lists" });
    console.log(res, "scried lists");
    set({ lists: res.lists });
  },
  subscribeFeed: async () => {
    const airlock = get().airlock;
    const reducer = (data: any) => {
      const { activeThread, activeFeed, activeGraph } = get();
      console.log(activeFeed, "af");
      console.log(data, "data");
      if ("feed-post-update" in data) {
        if ("thread-updated" in data["feed-post-update"]) {
          if (data["feed-post-update"]["thread-updated"]["host"] === activeFeed)
            liveUpdate(data, activeGraph, set);
          else if (data["feed-post-update"]["thread-updated"]["host"] !== get().our && activeFeed === "timeline")
            liveUpdate(data, activeGraph, set)
          else if (activeFeed === "thread")
            liveUpdateThread(data, activeThread, set)
        }
      } else if ("feed-engagement-update" in data){
        console.log(data["feed-engagement-update"])
      }
      // if (activeFeed === data.ship )
    };
    const res = await airlock.subscribe({
      app: "feed-store",
      path: "/frontend",
      event: reducer,
      err: (err: any, id: string) => console.log(err, "error on feed-store subscription"),
      quit: (data: any) => console.log(data, "feed-store subscription kicked")
    });
    console.log(res, "subscribed to feed store");
    console.log(airlock, "airlock")
  },
  subscribeHark: async () => { },
  policy: {
    read: { allow: [] },
    write: { allow: [] },
  },
  subscribeJoins: async () => {
    const airlock = get().airlock;
    const reducer = (data: any) => {
      console.log(data, "joins");
      if ("followed" in data["trill-follow-update"]) {
        const patp = data["trill-follow-update"].followed;
        const fa = { ship: patp, timestamp: Date.now() };
        set((state) => ({ follow_attempts: [...state.follow_attempts, fa] }));
      }
    };
    const res = await airlock.subscribe({
      app: "feed-pull-hook",
      path: "/joins",
      event: reducer,
      err: (err: any, id: string) => console.log(err, "error on joins subscription"),
      quit: (data: any) => console.log(data, "joins subscription kicked")
    });
    console.log(res, "subscribed to joins");
    console.log(airlock, "airlock")
  },
  follow_attempts: [],
  scryPolicy: async () => {
    const airlock = get().airlock;
    const res = await airlock.scry({ app: "feed-store", path: "/policy" });
    console.log(res, "scried policy");
    const policy = res.policy;
    set({ policy: policy });
  },
  changePolicy: async () => { },
  preview: "",
  setPreview: (patp: Ship) => set({ preview: patp }),
  replyTo: null,
  quoteTo: null,
  setReply: (node: Node | null) => set({ replyTo: node, quoteTo: null, highlighted: node, reactingTo: null }),
  setQuote: (node: Node | null) => set({ quoteTo: node, replyTo: null, highlighted: node, reactingTo: null  }),
  highlighted: null,
  resetHighlighted: () => set({ highlighted: null }),
  reactingTo: null,
  setReacting: (n) => set({highlighted: n, reactingTo: n, replyTo: null, quoteTo: null})
}));

export default useLocalState;

function liveUpdate(data: any, activeGraph: any, set: any) {
  const index: ID = data["feed-post-update"]["thread-updated"].thread.id
  const toAdd: any = {};
  toAdd[index] = data["feed-post-update"]["thread-updated"].thread;
  const newGraph = { ...activeGraph, ...toAdd };
  set({ activeGraph: newGraph })
}
function liveUpdateThread(data: any, activeThread: any, set: any) {
  if (data["feed-post-update"]["thread-updated"].thread.id === activeThread.id)
    set({ activeThread: data["feed-post-update"]["thread-updated"].thread });
}

// http://localhost:8080/~/scry/graph-store/graph/~zod/idle-chat-7267/node/siblings/newest/lone.json
// http://localhost:8080/~/scry/graph-store/graph/~zod/idle-chat-7267/node/siblings/newest/lone/100.json
