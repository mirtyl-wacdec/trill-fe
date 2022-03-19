import type { Node } from "../../logic/types";
import Sigil from "../../ui/Sigil";
import { date_diff } from "../../logic/utils";
import { ChevronNorth2, ChevronNorth, Svg } from "../../ui/Icons";

interface HeaderProps {
  node: Node;
}
function Header({ node }: HeaderProps) {
  return (
    <header>
      <div className="author">
        <div className="sigil">
          <Sigil patp={node.post.author} size={30} />
        </div>
        <div className="author">
          {/* <p className="nick">
             </p> */}
          <p className="p">{node.post.author}</p>
        </div>
      </div>
      <div className="nav-buttons">
        {node.post.thread !== node.id && <Svg icon={ChevronNorth2()} />}
        {node.post.parent && <Svg icon={ChevronNorth()} />}
      </div>
      <div className="date">
        <p>{date_diff(node.post["time"], "short")}</p>
      </div>
    </header>
  );
}

export default Header;
