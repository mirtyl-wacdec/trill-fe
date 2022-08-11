import { useState, useEffect } from "react";
import { Svg, Search } from "../ui/Icons";
import useLocalState from "../logic/state";
import Post from "./post/Post";
import { scryChangelog } from "../logic/actions";
import { nodesFromGraphUpdate } from "../logic/utils";
import type {GraphStoreNode} from "../logic/types";

function Home() {
  const { our, scryFeed, activeGraph } = useLocalState();
  const [node, setNode] = useState<GraphStoreNode>();
  useEffect(() => {
    scryChangelog()
      .then((res) => {
        const nodes = nodesFromGraphUpdate(res);
        setNode(nodes[0]);
      })
      .catch((err) => console.log("oops"));
  }, []);
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Changelog</h4>
      </header>
      <div id="feed">
        {node? (
          <div id="changelog">
            {node.post.contents.map(c => {
              if ("text" in c) return(
                c.text.split("\n").map(line => 
                <p>{line}</p>
                  )
              )
            })}
          </div>
        ) : (
          <p>
            Join ~mirtyl-wacdec/trill on Landscape to read the Trill changelog
          </p>
        )}
      </div>
    </div>
  );
}

export default Home;
