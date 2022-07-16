import {useState, useEffect} from "react";
import {Svg, Search} from "../ui/Icons"
import useLocalState from "../logic/state";
import Post from "./post/Post";

function Home(){
  const {our, scryTimeline, activeFeed, activeGraph} = useLocalState();
  useEffect(()=> {
    scryTimeline()
  }, [])
  console.log(activeFeed, "af")
  return(
    <div id="main-column">
      <header>
        <h4 id="column-title">Timeline</h4>
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

export default Home;