import {useState} from "react";
import type { Node } from "../../logic/types";
import Sigil from "../../ui/Sigil";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import useLocalState from "../../logic/state";

interface PostProps {
  node: Node;
  fake?: boolean;
}
function Post({ node, fake }: PostProps) {
  const {highlighted} = useLocalState();
  const cssClass = highlighted?.id === node.id ? "post highlighted-post" : "post";
  return (
    <div className={cssClass}>
      <div className="left">
        <div className="sigil">
          <Sigil patp={node.post.author} size={50} />
        </div>
      </div>
      <div className="right">
        <Header node={node} />
        <Body contents={node.post.contents} />
        {!fake && <Footer node={node}/>}
      </div>
    </div>
  );
}

export default Post;
