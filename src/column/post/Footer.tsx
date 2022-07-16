import type { Node } from "../../logic/types";
import { Svg, Info, LeapArrow, Messages, Smiley, Swap } from "../../ui/Icons";
import reply from "../../icons/reply.svg";
import quote from "../../icons/quote.svg";
import repost from "../../icons/repost.svg";
import { useState } from "react";
import useLocalState from "../../logic/state";
import { addPost } from "../../logic/actions";
interface FooterProps {
  node: Node;
}
function Footer({ node }: FooterProps) {
  const [reacts, setReacts] = useState(false);
  const { setReply, setQuote, setReacting } = useLocalState();
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

  // onClick={() => setReacts(!reacts)
  return (
    <footer>
      <div onClick={doReply} className="icon">
        <span className="reply-count">
          {childrenCount > 0 ? childrenCount : ""}
        </span>
        <img src={reply} alt="" />
      </div>
      <div onClick={doRP} className="icon">
        <span className="repost-count">
          {node.engagement.shared.length > 0
            ? node.engagement.shared.length
            : ""}
        </span>
        <img src={repost} alt="" />
      </div>
      <div onClick={doQuote} className="icon">
        <span className="quote-count">
          {node.engagement.quoted.length > 0
            ? node.engagement.quoted.length
            : ""}
        </span>
        <img src={quote} alt="" />
      </div>
      <div onClick={() => setReacting(node)} className="icon">
        <span className="reaction-count">
          {Object.keys(node.engagement.reacts).length
            ? Object.keys(node.engagement.reacts).length
            : ""}
        </span>
        <Svg icon={Smiley()} />
      </div>
    </footer>
  );
}

export default Footer;
