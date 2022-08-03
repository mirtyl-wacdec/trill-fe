import useLocalState from "../logic/state";
import { createList, saveToLists, scryFollowers, scryFollowing } from "../logic/actions";
import List from "./lists/List";
import type { ListType, Ship } from "../logic/types";
import { useEffect, useState } from "react";


function Lists() {
  const { lists, scryLists, sup, wex, setSup, setWex  } = useLocalState();
  useEffect(()=> {
    scryLists();
    setSup();
    setWex();
  }, [])
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Lists</h4>
      </header>
      <div className="lists">
        <List list={sup} fake={true} />
        <List list={wex} fake={true} />
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