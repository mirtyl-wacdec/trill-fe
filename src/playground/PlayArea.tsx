import type { ListType, Node } from "../logic/types";
import { useState, useEffect } from "react";
import Searchbox from "../ui/Searchbox";
import UserPreview from "../ui/UserPreview";
import useLocalState from "../logic/state";
import PlayComposer from "./PlayComposer";
import { useLocation } from "react-router-dom";
import ListSubMenu from "./ListSubMenu";
import { addReact, destroyList, editList } from "../logic/actions";
import { stringToSymbol } from "../logic/utils";
import { useNavigate } from "react-router-dom";


export default function () {
  const loc = useLocation();
  useEffect(() => {
    const split = loc.pathname.split("/");
    if (split[1] === "lists" && split.length === 2) setPlayArea("lists")
    else if (split[1] === "lists" && split[2] === "members") setPlayArea("listEdit")
    else if (!split.slice(2).includes(preview)) resetPlayArea();
  }, [loc]);
  const {
    playingWith,
    preview,
    replyTo,
    quoteTo,
    reactingTo,
    engagement,
    resetPlayArea,
    setPlayArea,
    browsingList
  } = useLocalState();
  return (
    <div id="play-column">
      <header>
        <Searchbox />
      </header>
      {playingWith === "userPreview" && <UserPreview patp={preview} />}
      {playingWith === "replyTo" && (
        <PlayComposer node={replyTo} interaction="reply" />
      )}
      {playingWith === "quoteTo" && (
        <PlayComposer node={quoteTo} interaction="quote" />
      )}
      {playingWith === "reactingTo" && <ReactionBox node={reactingTo} />}
      {playingWith === "lists" && <ListSubMenu />}
      {playingWith === "listEdit" && browsingList && <EditList />}
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

function Engagement() {
  const { engagement } = useLocalState();
  return (
    <div className="engagement">
      {engagement.type === "replies" && (
        <div className="replies">
          <p>Replied to by:</p>
          {engagement.ships.map((s) => {
            return <p key={s}>{s}</p>;
          })}
        </div>
      )}
      {engagement.type === "quotes" && (
        <div className="quotes">
          <p>Quoted by:</p>
          {engagement.quotes.map((q) => {
            return (
              <p key={JSON.stringify(q)}>
                <a href={`${q.host}/${q.id}`}>{q.host}</a>
              </p>
            );
          })}
        </div>
      )}
      {engagement.type === "reposts" && (
        <div className="reposts">
          <p>Reposted by:</p>
          {engagement.ships.map((s) => {
            return <p key={s}>{s}</p>;
          })}
        </div>
      )}
      {engagement.type === "reacts" && (
        <div className="replies">
          <p>Reacted to by:</p>
          {Object.entries(engagement.reacts).map((r) => {
            return (
              <p key={r[0]}>
                {r[0]}: {r[1]}
              </p>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EditList() {
  let navigate = useNavigate();
  const { browsingList, scryLists } = useLocalState();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [pub, setPublic] = useState(true);
  useEffect(() => {
    if (browsingList) {
      setName(browsingList.name);
      setDesc(browsingList.description);
      setPublic(browsingList.public);
    }
  }, [browsingList]);
  async function save() {
    const s = stringToSymbol(name);
    const l = {
      "new-symbol": s,
      "new-name": name,
      "new-desc": desc,
      "new-public": pub,
      "new-image": "",
    };
    const res = await editList(browsingList.symbol, l);
    if (res) scryLists();
  }
  async function destroy(){
    const res = await destroyList(browsingList.symbol)
    if (res) {
      await scryLists();
      navigate("/lists")
    }
  }
  return (
    <div id="edit-list">
      <h3>Edit List</h3>
      <label>Name:
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
      />
      </label>
      <label>Description:
      <input
        type="text"
        value={desc}
        onChange={(e) => setDesc(e.currentTarget.value)}
      />
      </label>
      <label>Public ? 
      <input
        type="checkbox"
        checked={pub}
        onChange={(e) => setPublic(e.currentTarget.checked)}
      />
      </label>
      <button onClick={save}>Save</button>
      <button id="destroy-list" onClick={destroy}>Destroy</button>
    </div>
  );
}
