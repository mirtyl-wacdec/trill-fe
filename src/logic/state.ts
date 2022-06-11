import create, { State } from "zustand";
import { bootstrapApi } from "./api";
import produce from "immer";
import Urbit from "@urbit/http-api";
import type { Node, ID, Ship, Graph } from "./types";
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
  scryFeed: (feed: string) => Promise<void>;
  scryFollows: () => Promise<void>;
  subscribeFeed: () => Promise<void>;
  subscribeHark: () => Promise<void>;
  subscribeJoins: () => Promise<void>;
  policy: Policy;
  scryPolicy: () => Promise<void>;
  changePolicy: () => Promise<void>;
  scryTimeline: () => Promise<void>;
  preview: Ship;
  setPreview: (s: Ship) => void;
  targetPost: Node | null;
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
  our: (window as any).ship || "~mitmun-botlyt",
  theme: "auto",
  fans: new Set([]),
  follows: new Set([]),
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
  airlock: new Urbit(""),
  init: () => {
    const airlock = bootstrapApi()
    set({ airlock: airlock, our: "~"+airlock.ship as string })},
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
  activeFeed: (window as any).ship || "put",
  activeGraph: {},
  scryFeed: async (feed: Ship) => {
    const airlock = get().airlock;
    const path = `/feed/${feed}`;
    const res = await airlock.scry({ app: "feed-store", path: path });
    console.log(res, "scried feed");
    if ("feed-scry" in res)
      set({
        activeGraph: res["feed-scry"]["feed"],
        activeFeed: feed,
      });
    else if ("not-follow" in res)
      set({
        activeFeed: "not-follow",
      });
  },
  scryTimeline: async () => {
    const airlock = get().airlock;
    const res = await airlock.scry({ app: "feed-store", path: "/timeline" });
    console.log(res, "scried timeline");
    set({ activeGraph: res.timeline.timeline });
  },
  scryFollows: async () => {
    const airlock = get().airlock;
    const res = await airlock.scry({ app: "feed-store", path: "/following" });
    console.log(res, "scried follows");
    console.log(airlock)
    // set({
    //   fans: res["feed-scry"]["follows"],
    //   follows: res["feed-scry"]["fans"],
    // });
    set({ follows: new Set(res["following"]) });
  },
  subscribeFeed: async () => {
    const airlock = get().airlock;
    const reducer = (data: any) => {
      const { activeFeed, activeGraph } = get();
      console.log(activeFeed, "af");
      console.log(data, "data");
      // if ("thread-updated" in data["feed-post-update"]){
      //   if (data["feed-post-update"]["thread-updated"]["host"] === activeFeed){
      //     const index : ID = data["feed-post-update"]["thread-updated"].thread.id
      //     const toAdd : any = {};
      //     toAdd[index] = data["feed-post-update"]["thread-updated"].thread;
      //     const newGraph = {...activeGraph, ...toAdd};
      //     set({activeGraph: newGraph})
      //   }
      // }

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
  subscribeHark: async () => {},
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
  changePolicy: async () => {},
  preview: "",
  setPreview: (patp: Ship) => set({ preview: patp }),
  targetPost: null,
}));

export default useLocalState;

// http://localhost:8080/~/scry/graph-store/graph/~zod/idle-chat-7267/node/siblings/newest/lone.json
// http://localhost:8080/~/scry/graph-store/graph/~zod/idle-chat-7267/node/siblings/newest/lone/100.json
