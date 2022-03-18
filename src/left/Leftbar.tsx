import { Link } from "react-router-dom";

function Leftbar() {
  return (
    <div id="leftbar">
      <Link className="link" to="/timeline">Timeline</Link>
      <Link className="link" to="/home">Home</Link>
      <Link className="link" to="/lists">Lists</Link>
      <Link className="link" to="/policy">Policy</Link>
      <Link className="link" to="/notifications">Notifications</Link>
    </div>
  );
}

export default Leftbar;
