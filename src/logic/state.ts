import create, { State } from "zustand";
import { URL, bootstrapApi } from "./api";
import produce from "immer";
import Urbit from "@urbit/http-api";
import type { ListType, Node, FullNode, ID, Ship, Graph, SubscriptionStatus, FollowAttempt, Key, Policy, Whitelist, Blacklist, EngagementDisplay, Notifications } from "./types";
import { scryFeed, scryFollowers, scryFollowing, scryFollows, scryHark, scryList, scryLists, scryNodeFlat, scryNodeFull, scryTimeline, subscribeFeed, subscribeHark } from "./actions";
import { NullIcon } from "../ui/Icons";
import { buntList } from "./bunts";

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
  followers: Set<Ship>;
  following: Set<Ship>;
  follow_attempts: FollowAttempt[];
  activeFeed: "timeline" | "notifications" | "not-follow" | "not-found" | Ship;
  activeGraph: Graph;
  activeThread: FullNode | null;
  lists: ListType[],
  sup: ListType,
  wex: ListType,
  setSup: () => void;
  setWex: () => void;
  scryFeed: (feed: string) => Promise<void>;
  scryThread: (host: Ship, id: ID) => Promise<void>;
  scryFollows: () => Promise<void>;
  scryHark: () => Promise<void>;
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
  setPlayArea: (l: PlayAreaOptions) => void;
  resetPlayArea: () => void;
  notifications: Notifications;
  browsingList: ListType | null;
  setBrowsingList: (l: ListType) => void;
};
type PlayAreaOptions = "replyTo"
  | "quoteTo"
  | "reactingTo"
  | "engagement"
  | "userPreview"
  | "lists"
  | "listEdit"
  | "editProfile"
  | ""

function wait(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
type LocalStateZus = LocalState & State;

const useLocalState = create<LocalStateZus>((set, get) => ({
  our: "~" + (window as any).ship,
  theme: "auto",
  followers: new Set([]),
  following: new Set([]),
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
    const res = await scryFeed(feed);
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
    const res = await scryTimeline();
    set({
      activeGraph: res.timeline.timeline,
      activeFeed: "timeline",
      highlighted: null
    });
  },
  scryFollows: async () => {
    const res = await scryFollowers();
    const res2 = await scryFollowing()
    // set({
    //   fans: res["feed-scry"]["follows"],
    //   follows: res["feed-scry"]["fans"],
    // });
    set({ following: new Set(res["following"]) });
  },
  scryLists: async () => {
    const res = await scryLists();
    set({ lists: res.lists });
  },
  scryList: async (s) => {
    const airlock = get().airlock;
    try {
      const res = await scryList(s);
      set({
        activeGraph: res.aggregate.feed,
        activeFeed: "list",
      });
    } catch {
      set({
        activeFeed: "wronglist",
        activeGraph: {}
      })
    }
  },
  sup: buntList,
  wex: buntList,
  setSup: async () => {
    const m = await scryFollowers()
    set({
      followers: new Set(m),
      sup: {
        name: "Followers",
        symbol: "followers",
        description: "",
        members: m.map(mm => {
          return { service: "urbit", username: mm }
        }),
        image: "",
        public: true
      }
    })
  },
  setWex: async () => {
    const m = await scryFollowing()
    set({
      following: new Set(m),
      wex: {
        name: "Following",
        symbol: "following",
        description: "",
        members: m.map(mm => {
          return { service: "urbit", username: mm }
        }),
        image: "",
        public: true
      }
    })
  },
  subscribeFeed: async () => {
    const reducer = (data: any) => {
      const { activeThread, activeFeed, activeGraph } = get();
      if ("feed-post-update" in data) {
        if ("thread-updated" in data["feed-post-update"]) {
          if (data["feed-post-update"]["thread-updated"]["host"] === activeFeed)
            liveUpdate(data, activeGraph, set);
          else if (data["feed-post-update"]["thread-updated"]["host"] !== get().our && activeFeed === "timeline")
            liveUpdate(data, activeGraph, set)
          else if (activeFeed === "thread")
            liveUpdateThread(data, activeThread, set)
        }
      } else if ("feed-engagement-update" in data) {
        if ("post-quoted" in data["feed-engagement-update"]) {
          const quote = data["feed-engagement-update"]["post-quoted"]
          if (activeThread && activeThread.id === quote.ab.id && activeThread.post.host === quote.ab.host) {
            activeThread.engagement.quoted = [...activeThread.engagement.quoted, quote.ship]
            set({ activeThread: activeThread })
          }
          else if (activeGraph && activeGraph[quote.ab.id]) {
            const node = activeGraph[quote.ab.id]
            node.engagement.quoted = [...node.engagement.quoted, quote.ship]
            set({ activeGraph: activeGraph })
          }
        }
        else if ("post-reposted" in data["feed-engagement-update"]) {
          const share = data["feed-engagement-update"]["post-reposted"]
          if (activeThread && activeThread.id === share.ab.id && activeThread.post.host === share.ab.host) {
            activeThread.engagement.shared = [...activeThread.engagement.shared, share.ship]
            set({ activeThread: activeThread })
          }
          else if (activeGraph && activeGraph[share.ab.id]) {
            const node = activeGraph[share.ab.id]
            node.engagement.shared = [...node.engagement.shared, share.ship]
            set({ activeGraph: activeGraph })
          }
        }
      }
    };
    subscribeFeed(reducer);
  },
  subscribeHark: async () => {
    const scry = get().scryHark;
    const reducer = (data: any) => {
      if (data) scry()
    }
    subscribeHark(reducer);
  },
  scryHark: async () => {
    const data = await scryHark();
    set({ notifications: data["trill-hark-scry"] })
  },
  policy: {
    read: { whitelist: [] },
    write: { whitelist: [] },
  },
  subscribeJoins: async () => {
    const airlock = get().airlock;
    const reducer = (data: any) => {
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
  },
  follow_attempts: [],
  scryPolicy: async () => {
    const airlock = get().airlock;
    const res = await airlock.scry({ app: "feed-store", path: "/policy" });
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
  setPlayArea: (l: PlayAreaOptions) => set({ playingWith: l }),
  resetPlayArea: () => set({ playingWith: "" }),
  notifications: {
    follows: [], unfollows: [], engagement: [], unread: []
  },
  browsingList: null,
  setBrowsingList: (l: ListType) => set({ browsingList: l })
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