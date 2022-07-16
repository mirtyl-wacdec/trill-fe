import { useState } from "react";
import useLocalState from "../logic/state";
import { createList } from "../logic/actions";
import { stringToSymbol } from "../logic/utils";
import List from "./lists/List";
import { useLocation } from "react-router-dom";

function Lists() {
  const location = useLocation();
  const { lists } = useLocalState();
  console.log(location, "lists");
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Lists</h4>
      </header>
      <div className="lists">
        {lists.map((l: any) => {
          return <List key={JSON.stringify(l)} list={l} />;
        })}
      </div>
    </div>
  );
}

export default Lists;
