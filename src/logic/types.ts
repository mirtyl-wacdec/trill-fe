export interface Graph {
  [keys: ID]: Node;
}
export interface GraphStoreNode {
  id: ID;
  post: Poast;
  children: Graph | null;
};
export type Node = FlatNode | FullNode;
export interface FlatNode {
  id: ID;
  post: Poast;
  children: Array<ID>;
  engagement: Engagement;
};
export interface FullNode {
  id: ID;
  post: Poast;
  children: Graph;
  engagement: Engagement;
};
export type ID = string; // 
export type Ship = string; // ~sampel
export interface Poast {
  host: Ship;
  author: Ship;
  contents: Content[];
  parent: ID | null;
  thread: ID;
  time: number;
}
export interface Engagement {
  reacts: ReactMap;
  quoted: Array<{ host: Ship; id: ID }>;
  shared: Array<{ host: Ship; id: ID }>;
}
export interface ReactMap {
  [key: Ship]: string; // emoji
}
export interface TextContent {
  text: string;
}
export interface URLContent {
  url: string;
}
interface MentionContent {
  mention: string;
}
// lets have external data as references too. TODO refine it.
export interface ReferenceContent {
  reference: ReferenceType

}
export type ReferenceType = LandscapePostReference
  | FeedReference
  | GroupReference
interface GroupReference {
  group: string;
}
export interface LandscapePostReference {
  graph: {
    graph: string;
    group: string;
    index: string;
  }
}
export interface FeedReference {
  feed: {
    id: ID;
    host: Ship;
  };
}
export interface TwatterReference {
  json: {
    origin: "twatter";
    content: string;
  };
}
interface CodeContent {
  code: {
    expression: string;
    output: string[][]
  };
}
export type Content =
  | TextContent
  | URLContent
  | MentionContent
  | ReferenceContent
  | CodeContent
  | ExternalContent;

export interface ExternalContent {
  json: {
    origin: "twatter" | "insta";
    content: string;
  };
}

type Service = "urbit" | "twitter";
export interface ListEntry {
  service: Service
  username: string
}
export interface ListType {
  description: string;
  members: ListEntry[];
  name: string;
  symbol: string;
  public: boolean;
}

export interface FollowAttempt {
  ship: Ship;
  timestamp: number;
}
export interface Key {
  ship: Ship;
  name: string;
}
export interface Policy {
  read: Whitelist | Blacklist;
  write: Whitelist | Blacklist;
}
export interface Whitelist {
  whitelist: Ship[];
}
export interface Blacklist {
  blacklist: Ship[];
}

export type SubscriptionStatus = "connected" | "disconnected" | "reconnecting";

export type EngagementDisplay = SimpleEngagementDisplay | ReactsDisplay | QuotesDisplay
interface SimpleEngagementDisplay {
  type: "replies" | "reposts"
  ships: Ship[]
}
interface QuotesDisplay {
  type: "quotes",
  quotes: PID[]
}

export interface PID {
  host: Ship,
  id: ID
}

interface ReactsDisplay {
  type: "reacts"
  reacts: { [s: Ship]: string }
}
// Notifications
export interface Notifications {
  follows: FollowNotification[];
  unfollows: UnfollowNotification[];
  engagement: Notification[];
  unread: PID[]
}
export type Notification =
  ReactNotification
  | ReplyNotification
  | QuoteNotification
  | RepostNotification
  | MentionNotification

export interface FollowNotification {
  follow: {
    ship: Ship, time: number
  }
}
export interface UnfollowNotification {
  unfollow: {
    ship: Ship, time: number
  }
}
export interface ReactNotification {
  react: {
    pid: PID,
    ship: Ship,
    react: string,
    time: number
  }
}
export interface ReplyNotification {
  reply: {
    ab: PID, ad: PID, ship: Ship, time: number
  }
}
export interface QuoteNotification {
  quote: {
    ab: PID, ad: PID, ship: Ship, time: number
  }
}
export interface RepostNotification {
  rt: {
    ab: PID, ad: PID, ship: Ship, time: number
  }
}
export interface MentionNotification {
  mention: {
    pid: PID, ship: Ship, time: number
  }
}
