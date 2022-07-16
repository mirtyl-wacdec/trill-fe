export interface Graph {
  [keys: ID]: Node;
}

type Node = FlatNode | FullNode;
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
  quoted: Array<{ ship: Ship; id: ID }>;
  shared: Array<{ ship: Ship; id: ID }>;
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
  reference:
    | LandscapePostReference
    | FeedReference
    | GroupReference
};
interface GroupReference {
  group: string;
}
interface LandscapePostReference {
  graph: string;
  group: string;
  index: string;
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
  code: string;
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