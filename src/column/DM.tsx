import useLocalState from "../logic/state";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import List from "./lists/List";
import type {
  GraphStoreNode,
  ListType,
  ReferenceContent,
  ReferenceType,
} from "../logic/types";
import { useLocation } from "react-router-dom";
import { isValidPatp, co } from "../logic/ob/co";
import {
  postDM,
  scryDM,
  scryGSNode,
  subscribeGS,
  unsub,
} from "../logic/actions";
import Sigil from "../ui/Sigil";
import { date_diff } from "../logic/utils";

function DMScreen() {
  const dmDiv = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    if (dmDiv && dmDiv.current)
      dmDiv.current.scrollTop = dmDiv.current.scrollHeight;
  }, [dmDiv]);

  const location = useLocation();
  const [patp, setPatp] = useState("");
  const [patpError, setPatpError] = useState(false);
  const [nodes, setNodes] = useState<GraphStoreNode[]>([]);
  const [sub, setSub] = useState(0);
  const [text, setText] = useState("");

  useEffect(() => {
    const patp = location.pathname.split("/")[2];
    if (isValidPatp(patp)) {
      setPatp(patp);
      subscribeGS((data) => {
        const graph = data["graph-update"]["add-nodes"]["nodes"];
        const resource = data["graph-update"]["add-nodes"]["resource"];
        const isDM = resource.name === "dm-inbox";
        const dec = Object.keys(graph)[0].split("/")[1];
        const isRightGuy = patp === co.patp(dec);
        if (isRightGuy) {
          const n = Object.keys(graph).map((index) => graph[index]);
          setNodes((nds) => [...nds, ...n]);
        }
      }).then((s) => {
        console.log(s, "subscribed to graph-store");
        setSub(s);
      });

      scryDM(patp).then((res) => {
        const graph = res["graph-update"]["add-nodes"]["nodes"];
        const n = Object.keys(graph)
          .sort()
          .map((index) => graph[index])
          .filter((nn) => !!nn.post.contents.length);
        setNodes(n);
      });
    } else setPatpError(true);
    return () => {
      unsub(sub).then((res) => console.log(res, "unsubscribed from gs"));
    };
  }, [location.pathname]);

  useEffect(() => {
    if (dmDiv && dmDiv.current)
      dmDiv.current.scrollTop = dmDiv.current.scrollHeight;
  }, [nodes]);
  async function sendDM(e: any) {
    e.preventDefault();
    const res = await postDM(patp, text);
    setText("");
    console.log(res, "sent");
  }

  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">DM with {patp}</h4>
      </header>
      {patpError ? (
        <p>Invalid @p</p>
      ) : (
        <div id="dm-container">
          <div ref={dmDiv} id="dm-nodes">
            {nodes.map((n, i) => (
              <DM key={n.id} gsNode={n} />
            ))}
          </div>
          <form onSubmit={sendDM}>
            <div id="dm-input">
              <input
                value={text}
                onChange={(e) => setText(e.currentTarget.value)}
                type="text"
                placeholder="Write DM"
              />
              <button type="submit">Send</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default DMScreen;

interface DMProps {
  gsNode: GraphStoreNode;
}

function DM({ gsNode }: DMProps) {
  return (
    <div className="dm">
      <div className="metadata">
        <div className="author">
          <div className="sigil">
            <Sigil patp={"~" + gsNode.post.author} size={30} />
          </div>
          <p>~{gsNode.post.author}</p>
        </div>
        <div className="time">
          <p>{date_diff(gsNode.post["time-sent"], "short")}</p>
        </div>
      </div>
      <div className="contents">
        {gsNode.post.contents.map((c, i) => {
          if ("text" in c)
            return <span key={gsNode.id + c.text}>{c.text}</span>;
          else if ("mention" in c)
            return <span key={gsNode.id + c.mention}>{c.mention}</span>;
          else if ("url" in c)
            return (
              <a href={c.url} key={gsNode.id + c.url}>
                {c.url}
              </a>
            );
          else if ("reference" in c)
            return (
              <Reference
                key={gsNode.id + JSON.stringify(c.reference)}
                r={c.reference}
              />
            );
          else if ("code" in c)
            return (
              <div
                key={gsNode.id + JSON.stringify(c.code)}
                className="codeblock"
              >
                <code>{c.code.expression}</code>
                <code>{">" + c.code.output.join("")}</code>
              </div>
            );
          else return <div key={gsNode.id}></div>;
        })}
      </div>
    </div>
  );
}

interface ReferenceProps {
  r: ReferenceType;
}
function Reference({ r }: ReferenceProps) {
  const [content, setContent] = useState<any>(null);
  async function openReference() {
    if ("graph" in r) {
      const res = await scryGSNode(r);
      const graph = res["graph-update"]["add-nodes"]["nodes"];
      const [node] = Object.keys(graph).map((i) => graph[i]);
      setContent(node);
    }
  }
  return (
    <div key={JSON.stringify(r)} className="reference">
      {content ? ( // TODO this only applies to Landscape posts
        <div className="reference-content">
          <DM gsNode={content} />
          <button onClick={() => setContent(null)}>Hide</button>
        </div>
      ) : (
        <div className="reference-preview">
          {"graph" in r ? (
            <p>Reference to {r.graph.graph}</p>
          ) : "group" in r ? (
            <p>Group {r.group}</p>
          ) : "feed" in r ? (
            <p>Reference to {r.feed.host}'s feed</p>
          ) : (
            ""
          )}
          <button onClick={openReference}>Open</button>
        </div>
      )}
    </div>
  );
}
