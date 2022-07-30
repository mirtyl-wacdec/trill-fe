import { useState } from "react";
import useLocalState from "../logic/state";
import {createList} from "../logic/actions";
import {stringToSymbol} from "../logic/utils";

function ListSubMenu() {
  const {scryLists} = useLocalState();
  const [input, setInput] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  function doCreate(){
    const s = stringToSymbol(input);
    createList(input, s, description, image).then(res => {
      console.log(res, "created list")
      scryLists()
      setInput("");
      setDescription("");
    })
  }
  return (
    <div id="list-submenu">
      <div className="playmenu-title">
      <p>New List</p>
      <button onClick={doCreate}>Save</button>
      </div>
      <input placeholder="List name" value={input} type="text" onInput={(e) => setInput(e.currentTarget.value)}/>
      <input placeholder="Description" value={description} type="text" onInput={(e) => setDescription(e.currentTarget.value)}/>
    </div>
  );
}

export default ListSubMenu;
