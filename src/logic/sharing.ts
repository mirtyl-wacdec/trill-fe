import { sendToLandscape } from "./actions";
import type { Association, GraphConfig, GSResource, Ship, Node, Content } from "./types";
import { buildChatPost, buildNotebookPost } from "./utils";


export async function shareTrill(our: Ship, n: Node, channel: Association) {
  let pokeObj;
  const graphType = (channel.metadata.config as GraphConfig).graph;
  const s = channel.resource.split("/");
  const r: GSResource = { entity: s[2] as Ship, name: s[3] };
  const contents = trillToGS(n);
  if (graphType === "chat") pokeObj = buildChatPost(our, r, contents);
  else if (graphType === "publish")
  pokeObj = buildNotebookPost(our, r, contents);
  return sendToLandscape(pokeObj);   
}

export function trillToGS(n: Node): Content[] {
  const header = { text: "/= - - - - - - - - - -  *[Trill Share](/apps/grid/perma?ext=web+urbitgraph://~diller-mirtyl-wacdec/trill/):* - - - - - - - - - - - =\\ \n " }
  const footer = { text: "\\= - - - - - - - - -  *[End of Trill Share](/apps/grid/perma?ext=web+urbitgraph://~diller-mirtyl-wacdec/trill/):* - - - - - - - - - - =/ \n " }
  const author = [{ text: "Trill by " }, { mention: n.post.author }, { text: `\n.\n ` }];
  const time = { text: `Posted on [${new Date(n.post.time).toUTCString()}](/apps/trill/${n.post.author}/${n.id})\n ` };
  const contents = n.post.contents;
  const filtered = contents.map(c => {
    if ("reference" in c && "feed" in c.reference)
      return { text: " \n.\n *Trill reference, please look on [UFA](/apps/grid/perma?ext=web+urbitgraph://~diller-mirtyl-wacdec/ufa/).*\n.\n " }
    else if ("json" in c)
      return { text: ` \n.\n *Web2 ${c.json.origin} reference, please look on [UFA](/apps/grid/perma?ext=web+urbitgraph://~diller-mirtyl-wacdec/ufa/).*\n.\n ` }
    else return c
  })
  return [header, ...author, time, { text: "\n.\n " }, ...filtered, { text: "\n.\n " }, footer]
}