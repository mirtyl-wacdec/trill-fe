import { useState, useEffect } from "react";
import type { Node, Ship } from "../../logic/types";
import Sigil from "../../ui/Sigil";
import Header from "./Header";
import Body from "./Body";
import Footer from "./Footer";
import useLocalState from "../../logic/state";
import { repostData } from "../../logic/utils";
import { scryNodeFlat } from "../../logic/actions";

interface PostProps {
  node: Node;
  fake?: boolean;
  rter?: Ship;
  rtat?: number;
}
function Post({ node, fake, rter, rtat }: PostProps) {
  const tombstoned = typeof node.post === "string";
  if (tombstoned) {
    console.log(node, "deleted node");
    return (
      <div className="post deleted-post">
        <p>Deleted post</p>
      </div>
    );
  } else {
    const { highlighted, setPreview } = useLocalState();
    const cssClass =
      highlighted?.id === node.id ? "post highlighted-post" : "post";
    const [rp, setRP] = useState<Node | null>(null);
    const [repostee, setRPP] = useState("");
    useEffect(() => {
      const rr = repostData(node);
      if (rr) {
        scryNodeFlat(rr.host, rr.id).then((res) => {
          if (res && "flat-node-scry" in res) setRP(res["flat-node-scry"]);
          else if (res && "not-follow" in res) setRPP(rr.host)
        });
      }
      return () => {
        setRP(null);
        setRPP("");
      };
    }, [node.id]);
    if (rp)
      return (
        <Post
          node={rp}
          fake={fake}
          rter={node.post.author}
          rtat={node.post.time}
        />
      );
    else if (!!repostee)
      return (
        <div className={cssClass}>
        <div className="left">
          <div onClick={() => setPreview(node.post.author)} className="sigil">
            <Sigil patp={node.post.author} size={50} />
          </div>
        </div>
        <div className="right">
        <Header node={node} rter={rter} rtat={rtat} />
          <div className="bad-rp">
            <p>Retweeting post by 
              <span className="repostee" onClick={()=> setPreview(repostee)}>{repostee},</span>
              who you do not follow.</p>
          </div>
        </div>
      </div>
      )
  else
      return (
        <div className={cssClass}>
          <div className="left">
            <div onClick={() => setPreview(node.post.author)} className="sigil">
              <Sigil patp={node.post.author} size={50} />
            </div>
          </div>
          <div className="right">
            <Header node={node} rter={rter} rtat={rtat} />
            <Body contents={node.post.contents} />
            {!fake && <Footer node={node} />}
          </div>
        </div>
      );
  }
}

export default Post;
