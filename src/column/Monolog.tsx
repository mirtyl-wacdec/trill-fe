import { useState, useEffect } from "react";
import useLocalState from "../logic/state";
import { useLocation } from "react-router-dom";
import Post from "./post/Post";
import Body from "./post/Body";
import Footer from "./post/Footer";
import type { Node, Graph, Ship, FlatNode, FullNode } from "../logic/types";
import { scryNodeFlat } from "../logic/actions";

interface MonologProps {
  node: FullNode;
}
function Monolog({ node }: MonologProps) {
  const own =  node.children 
  ? Object.keys(node.children)
  .map(index => node.children[index])
  .filter(p => p.post.author === node.post.author)
  : [];
  return (
    <div className="monolog">
      <Post node={node} />
      {own.map((p) => (
        <MiniThread key={p.id} node={p as FullNode} />
      ))}
    </div>
  );
}
function MiniThread({node}: MonologProps){
  const own =  node.children 
  ? Object.keys(node.children)
  .map(index => node.children[index])
  .filter(p => p.post.author === node.post.author)
  : [];
  return (
    <div className="thread-child">
        <MiniPost node={node as FullNode} />
        {own.map((p) => (
        <MiniThread key={p.id} node={p as FullNode} />
      ))}
    </div>
  );
}
function MiniPost({ node }: MonologProps) {
  return (
    <div className="thread-child">
      <Body contents={node.post.contents} />
      <Footer node={node} />
    </div>
  );
}
export default Monolog