import {useState, useEffect} from "react";
import {Svg, Search} from "../ui/Icons"
import useLocalState from "../logic/state";
import Post from "./post/Post";
import {useParams} from "react-router-dom";

export default function(){
  const {scryFeed, activeGraph, activeFeed} = useLocalState();
  const {username} = useParams();
  console.log(username, "u")
  useEffect(()=> {
    scryFeed("~"+username as string)
  }, [])
  console.log(activeGraph, "ag")
  return(
    <div id="main-column">
      <header>
        <h4 id="column-title">{"~"+username}</h4>
      </header>
      <div id="feed">
        {Object.keys(activeGraph)
        .sort((a, b) => activeGraph[b].post.time - activeGraph[a].post.time)
        .map(index => {
          return(
          <Post key={index} node={activeGraph[index]} />
          )
        })}
        </div>
      </div>
  )
}