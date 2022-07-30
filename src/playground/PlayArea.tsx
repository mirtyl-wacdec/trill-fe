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
  const { playingWith, preview, replyTo, quoteTo, reactingTo, engagement } = useLocalState();
  return (
    <div id="play-column">
      <header>
        <Searchbox />
      </header>
      {playingWith === "userPreview" && <UserPreview patp={preview} />}
      {playingWith === "replyTo" && <PlayComposer node={replyTo} interaction="reply" />}
      {playingWith === "quoteTo" && <PlayComposer node={quoteTo} interaction="quote" />}
      {playingWith === "reactingTo" && <ReactionBox node={reactingTo} />}
      {location.pathname.includes("lists") && <ListSubMenu />}
      {playingWith === "engagement" && <Engagement />}
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
      <span onClick={() => doReact(`😭`)} className="emoji">
      😭
      </span>
      <span onClick={() => doReact(`🥳`)} className="emoji">
      🥳
      </span>
      <span onClick={() => doReact(`😱`)} className="emoji">
      😱
      </span>
      <span onClick={() => doReact(`🤢`)} className="emoji">
        🤢
      </span>
    </div>
  );
}

function Engagement(){
  const { engagement, highlighted } = useLocalState();
  console.log(engagement, "eng")
  return (
    <div className="engagement">
      {engagement.type === "replies" && 
      <div className="replies">
        <p>Replied to by:</p>
        {engagement.ships.map(s => {
          return(
            <p key={s}>{s}</p>
          )
        })}
      </div>
      }
      {engagement.type === "quotes" && 
      <div className="quotes">
        <p>Quoted by:</p>
        {engagement.ships.map(s => {
          return(
            <p key={s}>{s}</p>
          )
        })}
      </div>
      }
      {engagement.type === "reposts" && 
      <div className="reposts">
        <p>Reposted by:</p>
        {engagement.ships.map(s => {
          return(
            <p key={s}>{s}</p>
          )
        })}
      </div>
      }
      {engagement.type === "reacts" && 
      <div className="replies">
        <p>Reacted to by:</p>
        {Object.entries(engagement.reacts).map(r => {
          return(
            <p key={r[0]}>{r[0]}: {r[1]}</p>
          )
        })}
      </div>
      }
    </div>
  )

}