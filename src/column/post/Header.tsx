import type { Node, Ship } from "../../logic/types";
import Sigil from "../../ui/Sigil";
import { date_diff } from "../../logic/utils";
import { ChevronNorth2, ChevronNorth, Svg } from "../../ui/Icons";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  node: Node;
  rter?: Ship;
  rtat?: number;
}
function Header({ node, rter, rtat }: HeaderProps) {
  let navigate = useNavigate();
  const gotoThread = () =>  navigate(`/${node.post.host}/${node.id}`);
  return (
    <header>
      <div className="metadata">
      <div className="author">
        <div className="name">
          {/* <p className="nick">
             </p> */}
          <p className="p">{node.post.author}</p>
        </div>
      </div>
      <div className="nav-buttons">
        {node.post.thread !== node.id && <Svg icon={ChevronNorth2()} />}
        {node.post.parent && <Svg icon={ChevronNorth()} />}
      </div>
      <div onClick={gotoThread} className="date">
        <p>{date_diff(node.post["time"], "short")}</p>
      </div>
      </div>
     {rter && 
     <div className="repost-data">
     <p>{rter} rp'd {date_diff(rtat as number, "short")} ago </p>
     </div>
     }
    </header>
  );
}

export default Header;
