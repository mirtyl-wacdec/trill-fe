import type { Ship } from "../logic/types";
import { useState, useEffect } from "react";
import { scryDMs } from "../logic/actions";
import { co } from "../logic/ob/co";

function Messages() {
  const [pals, setPals] = useState<Ship[]>([]);
  useEffect(() => {
    scryDMs().then((res) => {
      if (res["graph-update"]) {
        const dudes = Object.keys(
          res["graph-update"]["add-nodes"]["nodes"]
        ).map((nums) => co.patp(parseInt(nums.replace("/", ""))));
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
            <div key={patp} className="open-dm">
              {patp}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Messages;
