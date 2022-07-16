import type { Content } from "./types";
import { patp2dec, isValidPatp } from "./ob/co";
import anyAscii from 'any-ascii';
import type { Node } from "../logic/types";


type tokenizerData = [string, taggedContent[]];
type taggedContent = [string, Content];
type taggedRegex = [string, RegExp];

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,10}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g

export function tokenize(input: string): Content[] {
  let data: tokenizerData = [input, []];
  // data = extract_token(data, ["code", /```.+```/gs]); // codeblocks
  // data = extract_token(data, ["code", /`.+`/g]); // codelines
  // console.log(data, "extracted code")
  // data = extract_reference(data)        // references
  data = extract_mention(data); // mentions
  data = extract_token(data, [
    "url",
    URL_REGEX
    // /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi,
  ]); // urls
  return extract_text(data);
}
function extract_text(data: tokenizerData): Content[] {
  const uids = data[1].map((tuple) => tuple[0].replace(/;/g, ""));
  console.log(uids);
  const ret = data[0].split(";;").map((section) => {
    if (uids.includes(section)) {
      const r = data[1].find((tagged) => tagged[0] === `;;${section};;`);
      if (r) return r[1]
      else return { text: section } // errr idk
    }
    else return { text: section };
  });
  return ret;
}

function extract_token(data: tokenizerData, r: taggedRegex): tokenizerData {
  const matches = data[0].match(r[1]);
  if (!matches) return data;
  else
    return matches.reduce((acc, item) => {
      const uid = `;;${Math.random().toString(36).substring(8)};;`;
      let obj: any = {};
      obj[r[0]] = item;
      return [acc[0].replace(item, uid), [...acc[1], [uid, obj]]];
    }, data);
}

function extract_mention(data: tokenizerData): tokenizerData {
  const matches = data[0].match(/~[a-z_-]+/g);
  if (!matches) return data;
  else
    return matches.reduce((acc, item) => {
      const uid = `;;${Math.random().toString(36).substring(8)};;`;
      if (isValidPatp(item))
        return [
          acc[0].replace(item, uid),
          [...acc[1], [uid, { mention: item }]],
        ];
      else return acc;
    }, data);
}

import type { Ship, ID } from "./types";
export function createReference(ship: Ship, id: ID) {
  return {
    reference: {
      feed: { id: id, ship: ship }
    }
  }
}

export function addScheme(url: string) {
  if (url.includes("localhost")) {
    return `http://${url.replace("http://", "")}`;
  } else {
    return `https://${url.replace("http://", "")}`;
  }
}

export function easyCode(code: string) {
  const string = code.replace(/-/g, "");
  const matches = string.match(/.{1,6}/g)
  if (matches) return matches.join("-");
}


export function tilde(patp: Ship) {
  if (patp[0] == "~") {
    return patp;
  } else {
    return "~" + patp;
  }
}

export function color_to_hex(color: string) {
  let hex = "#" + color.replace(".", "").replace("0x", "").toUpperCase();
  if (hex == "#0") {
    hex = "#000000";
  }
  return hex;
}

export function date_diff(date: number, type: "short" | "long") {
  const now = new Date().getTime();
  const diff = now - new Date(date).getTime();
  if (type == "short") {
    return to_string(diff / 1000);
  } else {
    return to_string_long(diff / 1000);
  }
}

function to_string(s: number) {
  if (s < 60) {
    return "now";
  } else if (s < 3600) {
    return `${Math.ceil(s / 60)}m`;
  } else if (s < 86400) {
    return `${Math.ceil(s / 60 / 60)}h`;
  } else if (s < 2678400) {
    return `${Math.ceil(s / 60 / 60 / 24)}d`;
  } else if (s < 32140800) {
    return `${Math.ceil(s / 60 / 60 / 24 / 30)}mo`;
  } else {
    return `${Math.ceil(s / 60 / 60 / 24 / 30 / 12)}y`;
  }
}

function to_string_long(s: number) {
  if (s < 60) {
    return "right now";
  } else if (s < 3600) {
    return `${Math.ceil(s / 60)} minutes ago`;
  } else if (s < 86400) {
    return `${Math.ceil(s / 60 / 60)} hours ago`;
  } else if (s < 2678400) {
    return `${Math.ceil(s / 60 / 60 / 24)} days ago`;
  } else if (s < 32140800) {
    return `${Math.ceil(s / 60 / 60 / 24 / 30)} months ago`;
  } else {
    return `${Math.ceil(s / 60 / 60 / 24 / 30 / 12)} years ago`;
  }
}

export function regexes() {
  const IMAGE_REGEX = new RegExp(/(jpg|img|png|gif|tiff|jpeg|webp|webm|svg)$/i);
  const AUDIO_REGEX = new RegExp(/(mp3|wav|ogg)$/i);
  const VIDEO_REGEX = new RegExp(/(mov|mp4|ogv)$/i);
  return { img: IMAGE_REGEX, aud: AUDIO_REGEX, vid: VIDEO_REGEX };
}

export function stringToSymbol(str: string) {
  const ascii = anyAscii(str);
  let result = '';
  for (let i = 0; i < ascii.length; i++) {
    const n = ascii.charCodeAt(i);
    if ((n >= 97 && n <= 122) || (n >= 48 && n <= 57)) {
      result += ascii[i];
    } else if (n >= 65 && n <= 90) {
      result += String.fromCharCode(n + 32);
    } else {
      result += '-';
    }
  }
  result = result.replace(/^[\-\d]+|\-+/g, '-');
  result = result.replace(/^\-+|\-+$/g, '');
  return result;
}
export function buildDM(author: Ship, recipient: Ship, text: string) {
  const node: any = {};
  const point = patp2dec(recipient);
  console.log(point, "point")
  const index = `/${point}/${makeIndex()}`;
  node[index] = {
    children: null,
    post: {
      author: author,
      contents: [{ text: text }],
      hash: null,
      index: index,
      signatures: [],
      "time-sent": Date.now()
    }
  }
  return {
    app: "dm-hook", mark: "graph-update-3", json: {
      "add-nodes": {
        resource: { name: "dm-inbox", ship: author },
        nodes: node
      }
    }
  };
}
function makeIndex() {
  const DA_UNIX_EPOCH = BigInt('170141184475152167957503069145530368000');
  const DA_SECOND = BigInt('18446744073709551616');
  const timeSinceEpoch = (BigInt(Date.now()) * DA_SECOND) / BigInt(1000);
  return (DA_UNIX_EPOCH + timeSinceEpoch).toString()
}

export function nodeToText(n: Node): string {
  const c = n.post.contents;
  return c.reduce((acc, item) => {
    if ("text" in item) return acc + item.text
    else if ("mention" in item) return acc + item.mention
    else return acc
  }, "")
}
interface RepostData {
  id: ID,
  host: Ship
}
export function repostData(n: Node): RepostData | null {
  if (n.post.contents.length === 1
    && "reference" in n.post.contents[0]
    && "feed" in n.post.contents[0].reference)
    return {
      id: n.post.contents[0].reference.feed.id,
      host: n.post.contents[0].reference.feed.host
    }
  else return null
}