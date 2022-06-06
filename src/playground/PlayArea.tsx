import {useState, useEffect} from "react";
import Searchbox from "../ui/Searchbox";
import UserPreview from "../ui/UserPreview";
import useLocalState from "../logic/state";
import MiniComposer from "../ui/MiniComposer";


export default function(){
  const { preview, targetPost } = useLocalState();
  return(
    <div id="play-column">
      <header>
       <Searchbox />
      </header>
      {!!preview.length && <UserPreview patp={preview} />}
      {targetPost && <MiniComposer />}
      <div className="column-proper">
      </div>
    </div>
  )
}