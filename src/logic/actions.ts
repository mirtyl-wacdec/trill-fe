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