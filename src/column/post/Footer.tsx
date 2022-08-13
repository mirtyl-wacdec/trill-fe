import type { Node } from "../../logic/types";
import { Svg, Info, LeapArrow, Messages, Smiley, Swap } from "../../ui/Icons";
import reply from "../../icons/reply.svg";
import quote from "../../icons/quote.svg";
import repost from "../../icons/repost.svg";
import emoji from "../../icons/emoji.svg";
import menu from "../../icons/postmenu.svg";
import { useState, useEffect, useRef } from "react";
import useLocalState from "../../logic/state";
import { addPost, deletePost, scryNodeFull } from "../../logic/actions";
interface FooterProps {
  node: Node;
}
function Footer({ node }: FooterProps) {
  const [showMenu, setShowMenu] = useState(false);
  const { our, setReply, setQuote, setReacting, setEngagement } = useLocalState();
  const doReply = () => setReply(node);
  const doQuote = () => setQuote(node);
  const childrenCount = node.children
    ? node.children.length
      ? node.children.length
      : Object.keys(node.children).length
    : 0;

  const myRP = node.engagement.shared.find(s => s.host === our);
  function doRP() {
    if (myRP) cancelRP()
    else sendRP()
  }
  async function cancelRP(){
    const r = await deletePost(myRP.host, myRP.id);
    if (r) console.log("canceled")
  }
  async function sendRP(){
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
  function doReact() {
    setReacting(node);
  }
  function showReplyCount() {
    if (node.children[0]) fetchAndShow(); // FlatNode
    else {
      const authors = Object.keys(node.children).map(
        (i) => node.children[i].post.author
      );
      setEngagement({ type: "replies", ships: authors }, node);
    }
  }
  async function fetchAndShow() {
    let authors = [];
    for (let i of node.children as string[]) {
      const res = await scryNodeFull(node.post.host, i);
      authors.push(res["full-node-scry"]?.post?.author || "deleter");
    }
    setEngagement({ type: "replies", ships: authors }, node);
  }
  function showRepostCount() {
    const ships = node.engagement.shared.map((entry) => entry.host);
    setEngagement({ type: "reposts", ships: ships }, node);
  }
  function showQuoteCount() {
    setEngagement({ type: "quotes", quotes: node.engagement.quoted }, node);
  }
  function showReactCount() {
    setEngagement({ type: "reacts", reacts: node.engagement.reacts }, node);
  }

  function openMenu() {
    setShowMenu(true)
  }
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
        <img className={myRP ? "my-rp" : ""}
        onClick={doRP} src={repost} title={myRP ? "cancel repost": "repost"} />
      </div>
      <div className="icon">
        <span onClick={showQuoteCount} className="quote-count">
          {node.engagement.quoted.length > 0
            ? node.engagement.quoted.length
            : ""}
        </span>
        <img onClick={doQuote} src={quote} alt="" />
      </div>
      <div className="icon">
        <span onClick={showReactCount} className="reaction-count">
          {Object.keys(node.engagement.reacts).length
            ? Object.keys(node.engagement.reacts).length
            : ""}
        </span>
        <img onClick={doReact} src={emoji} alt="" />
      </div>
      <div className="icon">
        <img onClick={openMenu} src={menu} alt="" />
      </div>
      {showMenu && <Menu node={node} setShowMenu={setShowMenu} />}
    </footer>
  );
}

export default Footer;

function Menu({ node, setShowMenu }: any) {
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    const checkIfClickedOutside = e => {
      if (ref && ref.current && !ref.current.contains(e.target)) 
      setShowMenu(false);
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [])
  const { our, setPlayArea, setSharing } = useLocalState();
  const mine = our === node.host || our === node.post.author;
  function openShare() {
    setPlayArea("shareTrill");
    setSharing(node);
  }
  async function doDelete() {
    const res = await deletePost(node.post.host, node.id);
    if (res) console.log("deleted");
  }
  return (
    <div ref={ref} id="post-menu">
      <p onClick={openShare}>Share to Groups</p>
      {mine && <p onClick={doDelete}>Delete Post</p>}
    </div>
  );
}
