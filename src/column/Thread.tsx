import { useState, useEffect } from "react";
import useLocalState from "../logic/state";
import { useLocation } from "react-router-dom";
import Post from "./post/Post";
import Body from "./post/Body";
import Footer from "./post/Footer";
import Monolog from "./Monolog";
import type { Node, Graph, Ship, FlatNode, FullNode } from "../logic/types";
import { scryNodeFlat } from "../logic/actions";

function Thread() {
  const { scryThread, activeThread } = useLocalState();
  const location = useLocation();
  const [_, host, id] = location.pathname.split("/");
  useEffect(() => {
    const [_, host, id] = location.pathname.split("/");
    scryThread(host, id);
  }, [location]);
  console.log(activeThread, "at")
  // useEffect(() => {
  //   if (activeThread?.children) {
  //     for (let child of Object.keys(activeThread.children)) {
  //       if (activeThread.children[child].post.author === host)
  //         setMonolog((m) => [...m, activeThread.children[child]]);
  //       else setYaji((y) => [...y, activeThread.children[child]]);
  //     }
  //   }
  // }, [location]);
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Thread by {host}</h4>
      </header>
      <div className="thread">
          {activeThread && <Monolog node={activeThread as FullNode} />}
          {activeThread?.children && 
          <Replies replyGraph={activeThread?.children as Graph} author={activeThread.post.author}/>
}
      </div>
    </div>
  );
}

export default Thread;



interface RepliesProps {
  replyGraph: Graph;
  author: Ship
}
function Replies({replyGraph, author }: RepliesProps) {
  const array = Object.keys(replyGraph)
    .map(index => replyGraph[index])
    .filter(p => p.post.author !== author)
  return (
    <div className="replies">
      {array.map((p) => <Monolog key={p.id} node={p as FullNode} />)}
    </div>
  );
}