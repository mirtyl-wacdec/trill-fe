import { useState, useEffect, ChangeEvent } from "react";
import { scryGraphs } from "../logic/actions";
import { shareTrill } from "../logic/sharing";
import useLocalState from "../logic/state";
import { Association, GSKey } from "../logic/types";
import { cleanMetadata } from "../logic/utils";

function ShareTrill() {
  const { our, sharing } = useLocalState();
  const [channels, setChannels] = useState<Association[]>([]);
  const [options, setOptions] = useState<Association[]>([]);
  const [toShare, setToShare] = useState<Association[]>([]);
  const [query, setQuery] = useState("");
  useEffect(() => {
    scryGraphs().then((res) => {
      if (res) {
        const meta = cleanMetadata(res["metadata-update"].associations);
        setChannels(meta);
        setOptions(meta);
      }
    });
  }, []);

  function filter(e) {
    setQuery(e.currentTarget.value);
    const newOptions = channels.filter((o) => {
      return (
        o.groupName.toLowerCase().includes(query.toLowerCase()) ||
        o.metadata.title.toLowerCase().includes(query.toLowerCase()) ||
        o.metadata.description.toLowerCase().includes(query.toLowerCase()) ||
        o.metadata.creator.toLowerCase().includes(query.toLowerCase())
      );
    });
    setOptions(newOptions);
  }
  function setShare(e, c: Association) {
    if (e.target.checked) setToShare((o) => [...o, c]);
    else setToShare((o) => o.filter((oo) => oo.resource !== c.resource));
  }
  async function doShare() {
    for (let c of toShare) {
      await shareTrill(our, sharing, c)
    }
  }
  return (
    <div id="share-submenu">
      <div className="playmenu-title">
        <p>Share Trill to Landscape</p>
        <button onClick={doShare}>Share</button>
      </div>
      <div id="channel-search">
        <input
          placeholder="Filter channels"
          value={query}
          onChange={filter}
          type="text"
        />
      </div>
      <div className="keys">
        {options.map((c) => {
          return (
            <div key={JSON.stringify(c)} className="key">
              <div className="metadata">
                <p>
                  {c.groupName} - {c.metadata.title}{" "}
                </p>
              </div>
              <input onChange={(e) => setShare(e, c)} type="checkbox" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ShareTrill;
