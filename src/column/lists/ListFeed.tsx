import { useState, useEffect } from "react";
import { Svg, Search } from "../../ui/Icons";
import useLocalState from "../../logic/state";
import Post from "../post/Post";
import { useParams } from "react-router-dom";

export default function () {
  const { scryList, activeGraph, activeFeed } = useLocalState();
  const params = useParams();
  console.log(params, "params")
  console.log(activeFeed, "af");
  useEffect(() => {
    console.log("fetching list")
    scryList(params.listname);
  }, [params.listname]);
  if (activeFeed === "wronglist")
  return(
    <div id="main-column">
    <header>
      <h4 id="column-title">List Feed - Error</h4>
    </header>
      <div id="feed">
        <p>The list {params.listname} does not exist</p>
      </div>
  </div>
  )
  else
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">List Feed - {params.listname}</h4>
      </header>
        <div id="feed">
          {Object.keys(activeGraph)
            .sort((a, b) => activeGraph[b].post.time - activeGraph[a].post.time)
            .filter(a => !activeGraph[a].post.parent)
            .map((index) => {
              return <Post key={index} node={activeGraph[index]} />;
            })}
        </div>
    </div>
  );
}
