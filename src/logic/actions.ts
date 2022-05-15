import type {Ship, Content, Node} from "./types";
import useLocalState from "./state";

export async function addPost(contents: Content[], parent: Node | null) {
  const {airlock, our} = useLocalState.getState()
  const json = {
    "add-post": {
      host: parent ? parent.post.host : our,
      author: our,
      thread: parent ? parent.post.thread : null,
      parent: parent ? parent.id : null,
      contents: contents,
    },
  };
  return airlock.poke({
    app: "feed-push-hook",
    mark: "ufa-post-action",
    json: json,
  });
}

export async function setPolicy(sense: "read" | "write", locked: boolean){
  const {airlock, our} = useLocalState.getState()
  const obj: any = {};
  obj[sense] = locked ? "wl" : "bl";
  const json = {
    "change-policy": obj
  };
  return airlock.poke({
    app: "feed-store",
    mark: "ufa-feed-action",
    json: json,
  });
}
export async function setPolicyList(action: "b" | "ub" | "a" | "ua", sense: "read" | "write", ships: Ship[]){ 
  const obj: any = {};
   obj[sense] = ships;
   const b = {block: obj};
   const ub = {unblock: obj};
   const a = {allow: obj};
   const ua = {unallow: obj};

}