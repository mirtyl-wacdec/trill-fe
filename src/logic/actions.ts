import type {Ship, ID, Content, Node, ListEntry} from "./types";
import useLocalState from "./state";
import { buildDM } from "./utils";

// scries

export async function scryNodeFlat(host: Ship, id: ID): Promise<any>{
  const {airlock, our} = useLocalState.getState()
  const path = `/node/${host}/${id}`;
  const res = await airlock.scry({ app: "feed-store", path: path });
  return res
}
export async function scryNodeFull(host: Ship, id: ID): Promise<any>{
  const {airlock, our} = useLocalState.getState()
  const path = `/full-node/${host}/${id}`;
  const res = await airlock.scry({ app: "feed-store", path: path });
  return res
}

export async function addPost(contents: Content[], parent: Node | undefined) {
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

export async function addReact(ship: Ship, id: ID, reaction: string) {
  const {airlock, our} = useLocalState.getState()
  const json = {
    "add-react": {
      react: reaction,
      pid: {
        id: id,
        host: ship,
      },
    },
  };
  console.log(json, "poke sent");
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
  console.log(airlock, "airlock of follow")
  let sub: number;
  const handleData = (data: any) => {
    console.log(data, "data handled by /join subscription")
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
  const text = "Hi! I've been trying to follow you on Trill, the Urbit microblogging app. Do you have it? If not, go check it out at https://trill.com.";
  const pokeObj = buildDM(our, ship, text);
  const res = await airlock.poke(pokeObj);
  return res;
}
export async function createList(name: string, symbol: string, desc: string, image: string){
  const {airlock} = useLocalState.getState()
  const json = {create: {name: name, symbol: symbol, desc: desc, image: image}}
  const pokeObj = {app:"list-store", mark: "ufa-list-action", json: json}
  return await airlock.poke(pokeObj);
}

export async function addToList(listName: string, entry: ListEntry){
  const {airlock} = useLocalState.getState()
  const json = {add: {symbol: listName, entry: entry}}
  const pokeObj = {app:"list-store", mark: "ufa-list-action", json: json}
  return await airlock.poke(pokeObj);
}
export async function removeFromList(listName: string, entry: ListEntry){
  const {airlock} = useLocalState.getState()
  const json = {remove: {symbol: listName, entry: entry}}
  const pokeObj = {app:"list-store", mark: "ufa-list-action", json: json}
  return await airlock.poke(pokeObj);
}