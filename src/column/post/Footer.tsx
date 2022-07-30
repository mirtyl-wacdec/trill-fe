import type { Node } from "../../logic/types";
import { Svg, Info, LeapArrow, Messages, Smiley, Swap } from "../../ui/Icons";
import reply from "../../icons/reply.svg";
import quote from "../../icons/quote.svg";
import repost from "../../icons/repost.svg";
import emoji from "../../icons/emoji.svg";
import { useState } from "react";
import useLocalState from "../../logic/state";
import { addPost } from "../../logic/actions";
interface FooterProps {
  node: Node;
}
function Footer({ node }: FooterProps) {
  const [reacts, setReacts] = useState(false);
  const { setReply, setQuote, setReacting, setEngagement} = useLocalState();
  const doReply = () => setReply(node);
  const doQuote = () => setQuote(node);
  const childrenCount = node.children
    ? node.children.length
      ? node.children.length
      : Object.keys(node.children).length
    : 0;
  async function doRP() {
    console.log("reposting");
    const c = [
      {
        reference: {
          feed: {
            id: node.id,
            host: node.post.host,
          },
        },
      },
    ];
    const r = await addPost(c, undefined);
    if (r) console.log("posted");
  }
  function doReact(){
    setReacting(node)
  }
  function showReplyCount(){
    const authors = Object.keys(node.children).map(i => node.children[i].post.author);
    setEngagement({type: "replies", ships: authors}, node);
  }
  function showRepostCount(){
    console.log(node.engagement)
    const ships = node.engagement.shared.map(entry => entry.host)
    setEngagement({type: "reposts", ships:ships}, node);
  }
  function showQuoteCount(){
    setEngagement({type: "quotes", quotes: node.engagement.quoted}, node);
  }
  function showReactCount(){
    setEngagement({type: "reacts", reacts: node.engagement.reacts}, node);
  }

  // onClick={() => setReacts(!reacts)
  return (
    <footer>
      <div className="icon">
        <span onClick={showReplyCount} className="reply-count">
          {childrenCount > 0 ? childrenCount : ""}
        </span>
        <img onClick={doReply} src={reply} alt="" />
      </div>
      <div className="icon">
        <span onClick={showRepostCount} className="repost-count">
          {node.engagement.shared.length > 0
            ? node.engagement.shared.length
            : ""}
        </span>
        <img onClick={doRP} src={repost} alt="" />
      </div>
      <div className="icon">
        <span onClick={showQuoteCount} className="quote-count">
          {node.engagement.quoted.length > 0
            ? node.engagement.quoted.length
            : ""}
        </span>
        <img onClick={doQuote} src={quote} alt="" />
      </div>
      <div  className="icon">
        <span onClick={showReactCount} className="reaction-count">
          {Object.keys(node.engagement.reacts).length
            ? Object.keys(node.engagement.reacts).length
            : ""}
        </span>
        <img onClick={doReact} src={emoji} alt="" />
      </div>
    </footer>
  );
}

export default Footer;
