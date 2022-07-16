import type { Node } from "../../logic/types";
import { Svg, Info, LeapArrow, Messages, Smiley, Swap } from "../../ui/Icons";
import reply from "../../icons/reply.svg"
import quote from "../../icons/quote.svg"
import repost from "../../icons/repost.svg"
import { useState } from "react";
import useLocalState from "../../logic/state";
interface FooterProps {
  node: Node;
}
function Footer({ node }: FooterProps) {
  const [reacts, setReacts] = useState(false);
  const {setReply, setQuote} = useLocalState();
  const doReply = () => setReply(node);
  const doQuote = () => setQuote(node);
  

  // onClick={() => setReacts(!reacts)
  return (
    <footer>
      <div onClick={doReply} className="icon">
        <img src={reply} alt="" />
      </div>
      <div className="icon">
        <img src={repost} alt="" />
      </div>
      <div className="icon">
        <img src={quote} alt="" />
      </div>
      <div className="icon">
        <Svg icon={Smiley()} />
      </div>
    </footer>
  );
}

export default Footer;
