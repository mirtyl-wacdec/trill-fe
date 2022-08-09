import type { Notification, LandscapePostReference, Ship, ID, Content, Node, ListEntry, Policy, ListType, ListEdit } from "./types";
import useLocalState from "./state";
import { buildDM, tokenize } from "./utils";
import { patp2dec } from "./ob/co";

// scries

export async function scryNodeFlat(host: Ship, id: ID): Promise<any> {
  const { airlock, our } = useLocalState.getState()
  const path = `/node/${host}/${id}`;
  const res = await airlock.scry({ app: "feed-store", path: path });
  return res
}
export async function scryNodeFull(host: Ship, id: ID): Promise<any> {
  const { airlock } = useLocalState.getState()
  const path = `/full-node/${host}/${id}`;
  const res = await airlock.scry({ app: "feed-store", path: path });
  return res
}

export async function scryDMs() {
  const { airlock, our } = useLocalState.getState()
  const path = `/graph/${our}/dm-inbox/node/children/lone/~/~.json`;
  const res = await airlock.scry({ app: "graph-store", path: path });
  return res
}


export async function scryTimeline() {
  const { airlock } = useLocalState.getState()
  const res = await airlock.scry({ app: "feed-store", path: "/timeline" });
  return res
}
export async function scryFeed(s: Ship) {
  const { airlock } = useLocalState.getState()
  const res = await airlock.scry({ app: "feed-store", path: `/feed/${s}` });
  return res
}

export async function scryFollows() {
  const { airlock } = useLocalState.getState()
  const res = await airlock.scry({ app: "feed-store", path: "/following" });
  return res
}
export async function scryFollowers() {
  const { airlock } = useLocalState.getState()
  const res = await airlock.scry({ app: "feed-push-hook", path: "/sup" });
  return res
}
export async function scryFollowing() {
  const { airlock } = useLocalState.getState()
  const res = await airlock.scry({ app: "feed-pull-hook", path: "/wex" });
  return res
}
export async function scryLists() {
  const { airlock } = useLocalState.getState()
  const res = await airlock.scry({ app: "list-store", path: "/lists" });
  return res
}
export async function scryList(s: string) {
  const { airlock } = useLocalState.getState()
  const res = await airlock.scry({ app: "list-store", path: `/listfeed/${s}` });
  return res
}
export async function scryDM(patp: Ship) {
  const { airlock, our } = useLocalState.getState()
  const dec = patp2dec(patp);
  const dotted = dec.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const path = `/graph/${our}/dm-inbox/node/siblings/newest/lone/100/${dotted}`;
  console.log(path, "scry dm path")
  const res = await airlock.scry({ app: "graph-store", path: path });
  return res
}

export async function scryGSNode(reference: LandscapePostReference) {
  const { airlock } = useLocalState.getState()
  const [_, __, host, name] = reference.graph.graph.split("/");
  const index = reference.graph.index.replace("/", "");
  const dotted = index.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const path = `/graph/${host}/${name}/node/index/kith/${dotted}`;
  const res = await airlock.scry({ app: "graph-store", path: path });
  return res;
}

export async function scryHark() {
  const { airlock } = useLocalState.getState()
  const path = `/`;
  const res = await airlock.scry({ app: "feed-hark", path: path });
  return res
}

export async function scryChangelog() {
  const { airlock } = useLocalState.getState()
  const path = `/graph/~mirtyl-wacdec/trill-4.363/node/siblings/newest/lone/1`;
  const res = await airlock.scry({ app: "graph-store", path: path });
  return res
}

// scries>

// <subscriptions
type Handler = (date: any) => void;
export async function subscribeGS(handler: Handler) {
  const { airlock } = useLocalState.getState()

  const res = await airlock.subscribe({
    app: "graph-store",
    path: `/updates`,
    event: handler
  });
  return res
}

export async function unsub(sub: number) {
  const { airlock } = useLocalState.getState()
  const res = await airlock.unsubscribe(sub)
  return res
}

export async function subscribeFeed(handler: Handler) {
  const { airlock } = useLocalState.getState();
  const res = await airlock.subscribe({
    app: "feed-store",
    path: "/frontend",
    event: handler,
    err: (err: any, id: string) => console.log(err, "error on feed-store subscription"),
    quit: (data: any) => console.log(data, "feed-store subscription kicked")
  });
  console.log(res, "subscribed to feed store");
}

export async function subscribeHark(handler: Handler) {
  const { airlock } = useLocalState.getState();
  const res = await airlock.subscribe({
    app: "feed-hark",
    path: "/frontend",
    event: handler,
    err: (err: any, id: string) => console.log(err, "error on feed-hark subscription"),
    quit: (data: any) => console.log(data, "feed-hark subscription kicked")
  });
  console.log(res, "subscribed to feed hark");
}

// subscriptions>

export async function addPost(contents: Content[], parent: Node | undefined) {
  const { airlock, our } = useLocalState.getState()
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
    mark: "trill-post-action",
    json: json,
  });
}

export async function addReact(ship: Ship, id: ID, reaction: string) {
  const { airlock, our } = useLocalState.getState()
  const json = {
    "add-react": {
      react: reaction,
      src: our,
      pid: {
        id: id,
        host: ship,
      },
    },
  };
  return airlock.poke({
    app: "feed-push-hook",
    mark: "trill-post-action",
    json: json,
  });
}
export async function delReact(ship: Ship, id: ID) {
  const { airlock, our } = useLocalState.getState()
  const json = {
    "add-react": {
      src: our,
      pid: {
        id: id,
        host: ship,
      },
    },
  };
  return airlock.poke({
    app: "feed-push-hook",
    mark: "trill-post-action",
    json: json,
  });
}

export async function setPolicy(policy: Policy) {
  const { airlock, our } = useLocalState.getState()
  const json = {
    "set-policy": policy
  };
  return airlock.poke({
    app: "feed-store",
    mark: "trill-feed-action",
    json: json,
  });
}
export async function setPolicyList(action: "b" | "ub" | "a" | "ua", sense: "read" | "write", ships: Ship[]) {
  const obj: any = {};
  obj[sense] = ships;
  const b = { block: obj };
  const ub = { unblock: obj };
  const a = { allow: obj };
  const ua = { unallow: obj };
}

export async function fetchContact(patp: string) {
  const { airlock, our } = useLocalState.getState()
  return airlock.scry({ app: "contact-store", path: `/contact/${patp}` })
}
export async function follow(ship: Ship, fn: Function) {
  const { airlock } = useLocalState.getState()
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
  const { airlock, our } = useLocalState.getState()
  const json = { forget: ship };
  const res = await airlock.poke({
    app: "feed-pull-hook",
    mark: "trill-follow-action",
    json: json,
  });
  return res;
}

export async function sendDM(ship: Ship) {
  const { airlock, our } = useLocalState.getState()
  const text = "Hi! I've been trying to follow you on Trill, the Urbit microblogging app. Do you have it? If not, go check it out at https://trill.com.";
  const pokeObj = buildDM(our, ship, [{ text }]);
  const res = await airlock.poke(pokeObj);
  return res;
}
export async function begForInvite(ship: Ship) {
  const { airlock, our } = useLocalState.getState()
  const text = "Hi! I've been trying to follow you on Trill, but your account is locked. Can you not be a faggot please? Thank you.";
  const pokeObj = buildDM(our, ship, [{ text }]);
  const res = await airlock.poke(pokeObj);
  return res;
}
export async function createList(name: string, symbol: string, desc: string, image: string) {
  const { airlock } = useLocalState.getState()
  const json = { create: { name: name, symbol: symbol, desc: desc, image: image } }
  const pokeObj = { app: "list-store", mark: "trill-list-action", json: json }
  return await airlock.poke(pokeObj);
}

export async function addToList(listName: string, entry: ListEntry) {
  const { airlock } = useLocalState.getState()
  const json = { add: { symbol: listName, entry: entry } }
  const pokeObj = { app: "list-store", mark: "trill-list-action", json: json }
  return await airlock.poke(pokeObj);
}
export async function removeFromList(listName: string, entry: ListEntry) {
  const { airlock } = useLocalState.getState()
  const json = { remove: { symbol: listName, entry: entry } }
  const pokeObj = { app: "list-store", mark: "trill-list-action", json: json }
  return await airlock.poke(pokeObj);
}
export async function saveToLists(user: string, symbols: string[], lists: ListType[]) {
  const ress: any[] = []
  for (let list of lists) {
    const inList = list.members.map(l => l.username).includes(user);
    const wantInList = symbols.includes(list.symbol);
    if (!inList && wantInList) {
      const r = await addToList(list.symbol, { service: "urbit", username: user })
      ress.push(r)
    }
    else if (inList && !wantInList) {
      const r = await removeFromList(list.symbol, { service: "urbit", username: user })
      ress.push(r)
    }
  }
  return ress
}

export async function editList(symbol: string, l: ListEdit) {
  const { airlock } = useLocalState.getState()
  const json = {
    "big-edit": {
      symbol,
      "new-symbol": l["new-symbol"],
      "new-name": l["new-name"],
      "new-desc": l["new-desc"],
      "new-image": l["new-image"],
      "new-public": l["new-public"],
    }
  };
  const pokeObj = { app: "list-store", mark: "trill-list-action", json: json }
  return await airlock.poke(pokeObj);
}
export async function destroyList(symbol: string) {
  const { airlock } = useLocalState.getState()
  const json = { destroy: symbol };
  const pokeObj = { app: "list-store", mark: "trill-list-action", json: json }
  return await airlock.poke(pokeObj);
}
// misc
export async function rebuildTimeline() {
  const { airlock } = useLocalState.getState()
  const json = { "rebuild-timeline": null };
  const pokeObj = { app: "feed-store", mark: "trill-feed-action", json: json }
  return await airlock.poke(pokeObj);
}
export async function editContact(status: string, nickname: string, avatar: string, cover: string, color: string, bio: string) {
  const { our, airlock } = useLocalState.getState()
  const statusJson = {status}
  const nickJson = {nickname}
  const avatarJson = {avatar}
  const coverJson = {cover}
  const colorJson = {color};
  const bioJson = {bio}
  const baseJson = {edit: {timestamp: Date.now(), ship: our, "edit-field": {}}};
  const filter = [statusJson, nickJson, avatarJson, coverJson, bioJson].filter(j => Object.values(j)[0] !== "");
  console.log(filter, "filter")
  const ress = [];
  for (let obj of filter){
    baseJson.edit["edit-field"] = obj;
    const pokeObj = { app: "contact-store", mark: "contact-update-0", json: baseJson }
    const res = await airlock.poke(pokeObj);
    ress.push(res);
  }
  return ress;
}

// dms

export async function postDM(recipient: Ship, text: string) {
  const { airlock, our } = useLocalState.getState()
  const contents = tokenize(text);
  const pokeObj = buildDM(our, recipient, contents)
  return await airlock.poke(pokeObj)
}

// notifications

export async function wipeNotes() {
  const { airlock } = useLocalState.getState()
  const json = { wipe: null };
  const pokeObj = { app: "feed-hark", mark: "trill-hark-action", json: json }
  return await airlock.poke(pokeObj)
}

export async function dismissNote(n: Notification) {
  const { airlock } = useLocalState.getState()
  const json = { dismiss: n };
  const pokeObj = { app: "feed-hark", mark: "trill-hark-action", json: json }
  return await airlock.poke(pokeObj)
}