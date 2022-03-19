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
    <div id="main">
      <header>
        <p id="column-title">Home</p>
      </header>
      <div id="feed">
        {Object.keys(activeGraph).map(index => {
          return(
          <Post key={index} node={activeGraph[index]} />
          )
        })}
        </div>
      </div>
  )
}

export default Home;