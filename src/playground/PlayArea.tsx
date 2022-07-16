import type { Node } from "../logic/types";
import { useState, useEffect } from "react";
import Searchbox from "../ui/Searchbox";
import UserPreview from "../ui/UserPreview";
import useLocalState from "../logic/state";
import PlayComposer from "./PlayComposer";
import { useLocation } from "react-router-dom";
import ListSubMenu from "./ListSubMenu";
import { addReact } from "../logic/actions";

export default function () {
  const location = useLocation();
  const { preview, replyTo, quoteTo, reactingTo } = useLocalState();
  console.log(reactingTo, "re");
  return (
    <div id="play-column">
      <header>
        <Searchbox />
      </header>
      {!!preview.length && <UserPreview patp={preview} />}
      {replyTo && <PlayComposer node={replyTo} interaction="reply" />}
      {quoteTo && <PlayComposer node={quoteTo} interaction="quote" />}
      {reactingTo && <ReactionBox node={reactingTo} />}
      {location.pathname.includes("lists") && <ListSubMenu />}
    </div>
  );
}
interface RBProps {
  node: Node;
}
function ReactionBox({ node }: RBProps) {
  const { setReacting } = useLocalState();
  async function doReact(r: string) {
    const res = await addReact(node.post.host, node.id, r);
    if (res) setReacting(null);
  }
  return (
    <div id="react-menu">
      <p>React to Post</p>
      <span onClick={() => doReact(`😂`)} className="emoji">
        😂
      </span>
      <span onClick={() => doReact(`🤔`)} className="emoji">
        🤔
      </span>
      <span onClick={() => doReact(`👍`)} className="emoji">
        👍
      </span>
      <span onClick={() => doReact(`👎`)} className="emoji">
        👎
      </span>
      <span onClick={() => doReact(`👆`)} className="emoji">
        👆
      </span>
      <span onClick={() => doReact(`❤️`)} className="emoji">
        ❤️
      </span>
    </div>
  );
}
