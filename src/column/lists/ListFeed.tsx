import { useState, useEffect } from "react";
import { Svg, Search } from "../../ui/Icons";
import useLocalState from "../../logic/state";
import Post from "../post/Post";
import { useParams } from "react-router-dom";
import Spinner from "../../ui/Spinner";

export default function () {
  const [loading, setLoading] = useState(true);

  const { scryList, activeGraph, activeFeed } = useLocalState();
  const params = useParams();
  useEffect(() => {
    if (params.listname !== "followers" && params.listmame !== "following")
      scryList(params.listname).then((res) => setLoading(false));
  }, [params.listname]);
  if (activeFeed === "wronglist")
    return (
      <div id="main-column">
        <header>
          <h4 id="column-title">List Feed - Error</h4>
        </header>
        <div id="feed">
          <p>The list {params.listname} does not exist</p>
        </div>
      </div>
    );
  else
    return (
      <div id="main-column">
        <header>
          <h4 id="column-title">List Feed - {params.listname}</h4>
        </header>
        <div id="feed">
          {loading ? (
            <div className="spinner">
              <Spinner size={100} />
            </div>
          ) : (
            Object.keys(activeGraph)
              .sort(
                (a, b) => activeGraph[b].post.time - activeGraph[a].post.time
              )
              .filter((a) => !activeGraph[a].post.parent)
              .map((index) => {
                return <Post key={index} node={activeGraph[index]} />;
              })
          )}
        </div>
      </div>
    );
}
