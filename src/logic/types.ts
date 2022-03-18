export interface Graph {
  [keys: ID]: Node;
}
export interface Node {
  id: ID;
  post: Poast;
  children: Set<ID>;
  engagement: Engagement;
};
export type ID = string; // 
export type Ship = string; // ~sampel
export interface Poast {
  host: Ship;
  author: Ship;
  children: Poast[];
  contents: Content[];
  id: ID;
  likes: Ship[];
  parent: ID;
  thread: ID;
  time: number;
}
export interface Engagement {
  reacts: ReactMap;
  quoted: Set<{ ship: Ship; id: ID }>;
  shared: Set<{ ship: Ship; id: ID }>;
}
export interface ReactMap {
  [key: Ship]: string; // emoji
}
interface TextContent {
  text: string;
}
interface URLContent {
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