import create, { State } from 'zustand';
import {bootstrapApi} from './api';
import produce from 'immer';
import Urbit from "@urbit/http-api";
import type {Ship, Graph} from "./types";



export type SubscriptionStatus = 'connected' | 'disconnected' | 'reconnecting';


export interface LocalState {
  our: Ship,
  airlock: Urbit,
  theme: 'light' | 'dark' | 'auto';
  dark: boolean;
  mobile: boolean;
  breaks: {
    sm: boolean;
    md: boolean;
    lg: boolean;
  }
  subscription: SubscriptionStatus;
  reconnect: () => Promise<void>;
  bootstrap: () => Promise<void>;
  errorCount: number;
  init: () => void;
  fans: Set<Ship>,
  follows: Set<Ship>,
  activeFeed: "timeline" | "notifications" | Ship,
  activeGraph: Graph
  scryFeed: (feed: string) => Promise<void>;
  scryFollows: () => Promise<void>;
  subscribeFeed: () => Promise<void>;
  subscribeHark: () => Promise<void>;
  policy: Policy,
  scryPolicy: () => Promise<void>;
  changePolicy: () => Promise<void>;
}
interface Key{
  ship: Ship,
  name: string
}
interface Policy{
  read: string;
  write: string;
}
function wait(ms: number) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, ms);
  });
}
type LocalStateZus = LocalState & State;

const useLocalState = create<LocalStateZus>((set, get) => ({
  our: (window as any).ship || "myn",
  theme: "auto",
  fans: new Set([]),
  follows: new Set([]),
  dark: false,
  mobile: false,
  breaks: {
    sm: false,
    md: false,
    lg: false
  },
  subscription: 'connected',
  errorCount: 0,
  // XX this logic should be handled by eventsource lib, but channel
  // resume doesn't work properly
  airlock: bootstrapApi(),
  init: () => set({airlock: bootstrapApi()}),
  reconnect: async () => {
    const airlock = get().airlock;
    const { errorCount } = get();
    set(s => ({ errorCount: s.errorCount+1, subscription: 'reconnecting' }));

    if(errorCount > 5) {
      set({ subscription: 'disconnected' });
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
    set({ subscription: 'reconnecting', errorCount: 0 });
    if (airlock) airlock.reset();
    await bootstrapApi();
    set({ subscription: 'connected' });
  },
  // @ts-ignore investigate zustand types
  activeFeed: get().our,
  activeGraph: {},
  scryFeed: async(feed: string) => {
    const airlock = get().airlock;
    const res = await  airlock.scry({app: "feed-store", path: "/feed"});
    set({activeGraph: res["graph-update"]["keys"]})
  },
  scryFollows: async () => {
    const airlock = get().airlock;
    const res = await  airlock.scry({app: "feed-store", path: "/follows"});
    set({
      fans: res["feed-scry"]["follows"],
      follows: res["feed-scry"]["fans"]
    })
  },
  subscribeFeed: async () => {},
  subscribeHark: async () => {},
  policy: {read: "", write: ""},
  scryPolicy: async () => {
    const airlock = get().airlock;
    const res = await  airlock.scry({app: "feed-store", path: "/policy"});
    set({
      fans: res["feed-scry"]["follows"],
      follows: res["feed-scry"]["fans"]
    })
  },
  changePolicy: async () => {}
  }));

  export default useLocalState;

  // http://localhost:8080/~/scry/graph-store/graph/~zod/idle-chat-7267/node/siblings/newest/lone.json
  // http://localhost:8080/~/scry/graph-store/graph/~zod/idle-chat-7267/node/siblings/newest/lone/100.json