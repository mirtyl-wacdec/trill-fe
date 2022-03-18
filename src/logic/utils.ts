import type {Content} from "./types";
import {isValidPatp} from "./ob/co";

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
    if (uids.includes(section)){
      const r = data[1].find((tagged) => tagged[0] === `;;${section};;`);
      if (r) return r[1]
      else return {text: section} // errr idk
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