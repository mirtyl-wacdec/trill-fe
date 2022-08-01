import { useState, useEffect } from "react";
import { Svg, Search } from "../ui/Icons";
import useLocalState from "../logic/state";
import Post from "./post/Post";
import { rebuildTimeline } from "../logic/actions";

function Home() {
  const { our, scryTimeline, activeFeed, activeGraph } = useLocalState();
  useEffect(() => {
    scryTimeline();
  }, []);
  console.log(activeFeed, "af");
  console.log(activeGraph, "ag");
  async function rebuild() {
    const r = await rebuildTimeline();
    if (r) scryTimeline();
  }
  return (
    <div id="main-column" className="timeline-column">
      <header>
        <h4 id="column-title">Timeline</h4>
        <button onClick={rebuild}>Rebuild</button>
      </header>
      <div id="feed">
        {Object.keys(activeGraph)
          .sort((a, b) => activeGraph[b].post.time - activeGraph[a].post.time)
          .map((index) => (
            <Post key={index} node={activeGraph[index]} />
          ))}
      </div>
    </div>
  );
}

export default Home;
