import type { Node } from "../../logic/types";
import { Svg, Info, LeapArrow, Messages, Smiley, Swap } from "../../ui/Icons";
import reply from "../../icons/reply.svg"
import quote from "../../icons/quote.svg"
import repost from "../../icons/repost.svg"
import { useState } from "react";
interface FooterProps {
  node: Node;
}
function Footer({ node }: FooterProps) {
  const [reacts, setReacts] = useState(false);

  // onClick={() => setReacts(!reacts)
  return (
    <footer>
      <div className="icon">
        <p>{node.children.length}</p>
        <Svg icon={Messages()} />
      </div>
      <div className="icon">
        <p>{node.engagement.quoted.length}</p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke-width="2"
          stroke="currentColor"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
          <path d="M10 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"></path>
          <path d="M19 11h-4a1 1 0 0 1 -1 -1v-3a1 1 0 0 1 1 -1h3a1 1 0 0 1 1 1v6c0 2.667 -1.333 4.333 -4 5"></path>
        </svg>
      </div>
      <div className="icon">
        <p>{node.engagement.shared.length}</p>
        <Svg icon={Swap()} />
      </div>
      <div className="icon">
        <p>{Object.keys(node.engagement.reacts).length}</p>
        <Svg icon={Smiley()} />
      </div>
      <div className="icon">
        <Svg icon={LeapArrow()} />
      </div>
    </footer>
  );
}

export default Footer;
