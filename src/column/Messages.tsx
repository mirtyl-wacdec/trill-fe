import type { Ship } from "../logic/types";
import { useState, useEffect } from "react";
import { scryDMs } from "../logic/actions";
import { co } from "../logic/ob/co";
import Sigil from "../ui/Sigil";
import useLocalState from "../logic/state";
import { useNavigate } from "react-router-dom";


function Messages() {
  const [pals, setPals] = useState<Ship[]>([]);
  useEffect(() => {
    scryDMs().then((res) => {
      console.log(res, "dms")
      if (res["graph-update"]) {
        const dudes = Object.keys(
          res["graph-update"]["add-nodes"]["nodes"]
        ).map((num) => co.patp(num.replace("/", "")));
        setPals(dudes);
      }
      console.log(res, "scried DMs");
    });
  }, []);
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Direct Messages</h4>
      </header>
      <div className="dm-list">
        {pals.map((patp) => {
          return (
          <DM key={patp} patp={patp} />
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
interface LMProps {
  patp: string;
}
function DM({ patp }: LMProps) {
  let navigate = useNavigate();
  function openDM(){
    navigate(`/messages/${patp}`);
  }
  const { setPreview } = useLocalState();
  return (
    <div onClick={openDM} className="open-dm list-member">
      <div onClick={() => setPreview(patp)} className="sigil">
        <Sigil patp={patp} size={60} />
      </div>
      <p className="patp">{patp}</p>
    </div>
  );
}
