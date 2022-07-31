import useLocalState from "../logic/state";
import { createList, saveToLists } from "../logic/actions";
import List from "./lists/List";
import type { ListType } from "../logic/types";
import { useEffect } from "react";

function Lists() {
  useEffect(()=> {
    scryLists();
  }, [])
  const { lists, scryLists  } = useLocalState();
  console.log(lists, "lists");

  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Lists</h4>
      </header>
      <div className="lists">
        {lists
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((l: ListType) => {
            return <List key={JSON.stringify(l)} list={l} />;
          })}
      </div>
    </div>
  );
}

export default Lists;

interface ListProps {
  list: ListType;
}

