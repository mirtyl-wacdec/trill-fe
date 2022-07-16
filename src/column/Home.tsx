import {useState, useEffect} from "react";
import {Svg, Search} from "../ui/Icons"
import useLocalState from "../logic/state";
import Post from "./post/Post";

function Home(){
  const {our, scryFeed, activeGraph} = useLocalState();
  useEffect(()=> {
    scryFeed(our)
  }, [])
  console.log(activeGraph, "ag")
  return(
    <div id="main-column">
      <header>
        <h4 id="column-title">Home</h4>
      </header>
      <div id="feed">
        {Object.keys(activeGraph)
        .sort((a, b) => activeGraph[b].post.time - activeGraph[a].post.time)
        .filter(a => !activeGraph[a].post.parent)
        .map(index => {
          return(
          <Post key={index} node={activeGraph[index]} />
          )
        })}
        </div>
      </div>
  )
}

export default Home;