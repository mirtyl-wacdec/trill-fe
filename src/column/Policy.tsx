import { useState, useEffect } from "react";
import useLocalState from "../logic/state";
import { setPolicy, setPolicyList } from "../logic/actions";
import { isValidPatp } from "../logic/ob3/co";
type listType = "blacklist" | "whitelist"
function Policy() {

  const { policy } = useLocalState();
  const [checked, setChecked] = useState(false);
  const [readValue, setReadValue] = useState("");
  const [readError, setReadError] = useState(false);
  const [readLocked, setReadLocked] = useState(false);
  const [writeLocked, setWriteLocked] = useState(false);
  const [writeValue, setWriteValue] = useState("");
  const [writeError, setWriteError] = useState(false);
  const [readList, setReadList] = useState<string[]>([]);
  const [writeList, setWriteList] = useState<string[]>([]);
  useEffect(()=> {
    setReadLocked("whitelist" in policy.read);
    setWriteLocked("whitelist" in policy.write);
  }, [policy])
  useEffect(() => {
    if (readLocked) setReadList((policy.read as any).whitelist || []);
    else setReadList((policy.read as any).blacklist || [])
  }, [readLocked])
  useEffect(() => {
    if (writeLocked) setWriteList((policy.write as any).whitelist || []);
    else setWriteList((policy.write as any).blacklist || [])
  }, [writeLocked])

  async function savePolicy() {
    const newRead = readLocked ?  {whitelist: readList} :  {blacklist:readList}
    const newWrite = writeLocked ? {whitelist: writeList} : {blacklist:writeList}
    const newPolicy = {
      read: newRead,
      write: newWrite
    }
    console.log(newPolicy, "np")
    const sp = await setPolicy(newPolicy);
    console.log(sp, "sp")
    // const list = await setPolicyList("a", tab, plist)
    // console.log(list, "list")
  }


  function addToRead() {
    if (isValidPatp(readValue))
      setReadList((e) => [...e, readValue]), setReadValue("");
    else setReadError(true);
  }
  function addToWrite() {
    if (isValidPatp(writeValue))
      setWriteList((e) => [...e, writeValue]), setWriteValue("");
    else setWriteError(true);
  }

  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Settings</h4>
      </header>
      <div id="policy">
        <h3>Permissions</h3>
        <button onClick={savePolicy}>Save</button>
        <div className="read-settings">
          <div className="settings-title">
          <h4>Read</h4>
          <p>
            {readLocked ? "locked" : "unlocked"}
            </p>
          <input
            type="checkbox"
            checked={readLocked}
            onChange={() => setReadLocked(!readLocked)}
          />
          </div>
          <p>{readLocked ? "Whitelist" : "Blacklist" }</p>
          <div className="ship-list">
            {readList.map((entry, i) => (
              <div
                onClick={() => setReadList(readList.filter((r) => r != entry))}
                className={`blacklist-entry`}
                key={entry + `${i}`}
              >
                {entry}
              </div>
            ))}
          </div>
          <div className="read-input">
            <input
              type="text"
              value={readValue}
              onChange={(e) => {
                setReadError(false)
                setReadValue(e.currentTarget.value)
              }}
            />
            <button onClick={addToRead}>Add</button>
            <span className="error">{readError ? "Not a valid @p" : ""}</span>
          </div>
        </div>
        <div className="write-settings">
        <div className="settings-title">
          <h4>Write</h4>
          <p>
            {writeLocked ? "locked" : "unlocked"}
            </p>
          <input
            type="checkbox"
            checked={writeLocked}
            onChange={() => setWriteLocked(!writeLocked)}
          />
          </div>
          <p>{writeLocked ? "Whitelist" : "Blacklist" }</p>
          <div className="ship-list">
            {writeList.map((entry, i) => (
              <div
                onClick={() => setWriteList(writeList.filter((r) => r != entry))}
                className={`blacklist-entry`}
                key={entry + `${i}`}
              >
                {entry}
              </div>
            ))}
          </div>
          <div className="write-input">
            <input
              type="text"
              value={writeValue}
              onChange={(e) => {
                setWriteError(false)
                setWriteValue(e.currentTarget.value)
              }}
            />
            <button onClick={addToWrite}>Add</button>
            <span className="error">{writeError ? "Not a valid @p" : ""}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Policy;
