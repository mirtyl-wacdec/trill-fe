import create, { State } from "zustand";
import { URL, bootstrapApi } from "./api";
import produce from "immer";
import Urbit from "@urbit/http-api";
import type { ListType, Node, FullNode, ID, Ship, Graph, SubscriptionStatus, FollowAttempt, Key, Policy, Whitelist, Blacklist, EngagementDisplay, Notifications } from "./types";
import { scryHark, scryNodeFlat, scryNodeFull, subscribeFeed, subscribeHark } from "./actions";
import { NullIcon } from "../ui/Icons";

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
  lists: ListType[],
  scryFeed: (feed: string) => Promise<void>;
  scryThread: (host: Ship, id: ID) => Promise<void>;
  scryFollows: () => Promise<void>;
  scryLists: () => Promise<void>;
  scryList: (symbol: string) => Promise<void>;
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
  engagement: EngagementDisplay | null;
  setEngagement: (e: EngagementDisplay, n: Node) => void;
  playingWith: PlayAreaOptions;
  resetPlayArea: () => void;
  notifications: Notifications
};
type PlayAreaOptions = "replyTo" | "quoteTo" | "reactingTo" | "engagement" | "userPreview" | "lists" | ""

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
  airlock: new Urbit(URL),
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
  scryList: async (s) => {
    const airlock = get().airlock;
    try {
      const res = await airlock.scry({ app: "list-store", path: `/listfeed/${s}` });
      console.log(res, "scried list");
      set({
        activeGraph: res.aggregate.feed,
        activeFeed: "list",
      });
    } catch {
      set({
        activeFeed:"wronglist",
        activeGraph:{}
      })
    }
  },
  subscribeFeed: async () => {
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
        else if ("react-added" in data["feed-post-update"]) {

        }
      } else if ("feed-engagement-update" in data) {
        console.log(data["feed-engagement-update"])
      }
      // if (activeFeed === data.ship )
    };
    subscribeFeed(reducer);
  },
  subscribeHark: async () => { 
    const data = await scryHark();
    const reducer = (data: any) => {
      console.log(data, "hark data")
    }
    subscribeHark(reducer);
    set({notifications: data["trill-hark-scry"]})
  },
  policy: {
    read: { whitelist: [] },
    write: { whitelist: [] },
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
      else if ("not-allow" in data["trill-follow-update"]) {
        // weird
        console.log()
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
  setPreview: (patp: Ship) => {
    if (patp === "") set({ preview: patp, playingWith: null })
    else set({ preview: patp, playingWith: "userPreview" })
  },
  replyTo: null,
  quoteTo: null,
  setReply: (node: Node | null) => set({ replyTo: node, highlighted: node, playingWith: "replyTo" }),
  setQuote: (node: Node | null) => set({ quoteTo: node, highlighted: node, playingWith: "quoteTo" }),
  highlighted: null,
  resetHighlighted: () => set({ highlighted: null }),
  reactingTo: null,
  setReacting: (n) => set({ highlighted: n, reactingTo: n, playingWith: "reactingTo" }),
  engagement: null,
  setEngagement: (e: EngagementDisplay, n: Node) => set({ engagement: e, highlighted: n, playingWith: "engagement" }),
  playingWith: "",
  resetPlayArea: () => set({ playingWith: "" }),
  notifications: {
    follows: [], unfollows: [], engagement: [], unread: []
  }
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