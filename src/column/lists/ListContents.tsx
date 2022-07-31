import { useState, useEffect } from "react";
import useLocalState from "../../logic/state";
import { useLocation } from "react-router-dom";
import Sigil from "../../ui/Sigil";

function ListContents() {
  const location = useLocation();
  const listName = location.pathname.split("/")[3];
  const { lists, setBrowsingList } = useLocalState();
  const [list, setList] = useState<any>({});
  console.log(location.pathname.split("/"), "lists");
  console.log(lists, "lists");
  useEffect(() => {
    const muhlist = lists.find((l) => l.symbol === listName);
    console.log(muhlist, "ml")
    if (muhlist) {
      setList(muhlist);
      setBrowsingList(muhlist)
    }
  }, [location, lists]);
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">List - {listName}</h4>
      </header>
      <div className="lists">
        {(!list.members || list.members.length === 0) &&
        <p>Empty list</p> }
        {list?.members && list.members.map((l: any) => {
          if (l.service === "urbit")
            return (
              <ListMember
                key={JSON.stringify(l)}
                name={l.username}
                service={l.service}
              />
            );
          else
            return (
              <ExternalListMember
                key={JSON.stringify(l)}
                name={l.username}
                service={l.service}
              />
            );
        })}
      </div>
    </div>
  );
}

export default ListContents;

interface LMProps {
  name: string;
  service: string;
}
function ListMember({ name }: LMProps) {
  function promptDelete(){

  }
  const { setPreview } = useLocalState();
  return (
    <div onClick={() => setPreview(name)} className="list-member">
      <div className="sigil">
        <Sigil patp={name} size={60} />
      </div>
      <p className="patp">{name}</p>
      <div onClick={promptDelete} className="delete-icon">
        X
      </div>
    </div>
  );
}

function ExternalListMember({ name, service }: LMProps) {
  return (
    <div className="list-member external-list-member">
      <p>{name}</p>
      <p className="disclaimer">
        User from external service "{service}", use <a href="">UFA</a> app to
        display
      </p>
    </div>
  );
}
