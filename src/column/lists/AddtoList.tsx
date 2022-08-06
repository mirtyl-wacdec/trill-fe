import { useState, useEffect } from "react";
import useLocalState from "../../logic/state";
import { saveToLists } from "../../logic/actions";
import type { ListType } from "../../logic/types";
import { useLocation } from "react-router-dom";
import { isValidPatp } from "../../logic/ob/co";
import { useNavigate } from "react-router-dom";

function Lists() {
  let navigate = useNavigate();

  // patp validation
  const location = useLocation();
  const [patpError, setPatpError] = useState(false);
  const [patp, setPatp] = useState("");
  const [addingToList, setAddingToList] = useState<string[]>([])
  useEffect(()=> {
    const patp = location.pathname.split("/")[3];
    if (isValidPatp(patp)){
      setPreview(patp)
      setPatp(patp)
    } else setPatpError(true)
  }, [location.pathname]);
  const { lists, setPreview } = useLocalState();
  async function saveLists() {
    const r = await saveToLists(patp, addingToList, lists);
    if (r) navigate("/lists")
  }
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Lists</h4>
      </header>
      {patpError ? 
      <p>Invalid @p</p>
      :
      <div className="lists">
        <p>Adding {patp} to:</p>
        <button onClick={saveLists}>Save</button>
        {lists
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((l: ListType) => {
            return <SmallList key={JSON.stringify(l)} list={l} patp={patp} addingToList={addingToList} add={setAddingToList} />;
          })}
      </div>
}
    </div>
  );
}

export default Lists;

interface ListProps {
  list: ListType;
  patp: string;
  addingToList: string[];
  add: Function;
}

function SmallList({ list, patp, addingToList, add }: ListProps) {
  useEffect(() => {
    if (list.members.map((l) => l.username).includes(patp)) {
      add(a => [...a, list.symbol]);
    }
    // else setHighlighted(false)
  }, [patp, list]);


  function toggleList() {
    if (addingToList.includes(list.symbol))
      add(addingToList.filter((l) => l !== list.symbol));
    else add([...addingToList, list.symbol]);
  }
  return (
    <div
      onClick={toggleList}
      className={`list ${addingToList.includes(list.symbol) ? "highlighted-list" : ""}`}
    >
      <div className="title">
        <h4>{list.name}</h4>
        <p>{list.description}</p>
      </div>
      <div className="s-members">
        <p>{list.members.length}</p>
      </div>
    </div>
  );
}
