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

export async function fetchContact(patp: string){
  const {airlock, our} = useLocalState.getState()
  return airlock.scry({app: "contact-store", path: `/contact/${patp}`})
}
export async function follow(ship: Ship, fn: Function) {
  const {airlock, our} = useLocalState.getState()
  console.log(airlock, "airlock")
  let sub: number;
  const handleData = (data: any) => {
    fn(data)
  };
  const res = await airlock.subscribe({
    app: "feed-pull-hook",
    path: `/join/${ship}`,
    event: handleData
  });
  console.log(res, "subscribed to feed-pull-hook/join ")
  sub = res;
}

export async function unfollow(ship: Ship) {
  const {airlock, our} = useLocalState.getState()
  const json = { forget: ship };
  const res = await airlock.poke({
    app: "feed-pull-hook",
    mark: "ufa-follow-action",
    json: json,
  });
  return res;
}

export async function sendDM(ship: Ship){
  const {airlock, our} = useLocalState.getState()
  const json = {};
  const res = await airlock.poke({
    app: "dm-hook",
    mark: "graph-update-3",
    json: json,
  });
  return res;
}