import {useState, useEffect} from "react";
import Searchbox from "../ui/Searchbox";
import UserPreview from "../ui/UserPreview";
import useLocalState from "../logic/state";
import MiniComposer from "../ui/MiniComposer";
import { useLocation } from 'react-router-dom';
import ListSubMenu from "./ListSubMenu";

export default function(){
  const location = useLocation();
  const { preview, replyTo, quoteTo } = useLocalState();
  return(
    <div id="play-column">
      <header>
       <Searchbox />
      </header>
      {!!preview.length && <UserPreview patp={preview} />}
      {replyTo && <MiniComposer replyTo={replyTo}/>}
      {quoteTo && <MiniComposer quote={quoteTo}/>}
      <div className="column-proper">
        {location.pathname.includes("lists") &&
        <ListSubMenu />
        }
      </div>
    </div>
  )
}