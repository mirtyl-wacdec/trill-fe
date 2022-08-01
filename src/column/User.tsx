import { useState, useEffect } from "react";
import { Svg, Search } from "../ui/Icons";
import useLocalState from "../logic/state";
import Post from "./post/Post";
import { useParams } from "react-router-dom";
import FollowPrompt from "../following/FollowPrompt";

export default function () {
  const { scryFeed, activeGraph, activeFeed } = useLocalState();
  const { username } = useParams();
  console.log(activeFeed, "af");
  console.log(activeGraph, "ag")
  useEffect(() => {
    scryFeed(("~" + username) as string);
  }, [username]);
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">{"~" + username}</h4>
      </header>
      {activeFeed === "not-follow" ? (
        <FollowPrompt username={username as string} />
      ) : (
        <div id="feed">
          {Object.keys(activeGraph)
            .sort((a, b) => activeGraph[b].post.time - activeGraph[a].post.time)
            .filter(a => !activeGraph[a].post.parent)
            .map((index) => {
              return <Post key={index} node={activeGraph[index]} />;
            })}
        </div>
      )}
    </div>
  );
}
