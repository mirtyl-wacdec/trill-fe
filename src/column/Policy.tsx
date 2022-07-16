import {useState, useEffect} from "react";
import useLocalState from "../logic/state";
import {setPolicy, setPolicyList} from "../logic/actions";
function Policy() {
  const {policy} = useLocalState();
  const [tab, setTab] = useState<"read" | "write">("read")
  const [checked, setChecked] = useState(false);
  const [plist, setPlist] = useState<string[]>([])
  useEffect(()=> {
    if (tab == "read") {
      setChecked("allow" in policy.read);
      const content = ("not-allow" in policy.read) ? policy.read["not-allow"] : policy.read["allow"]
      setPlist(content)
    }
    else{
      setChecked("allow" in policy.write);
      const content = ("not-allow" in policy.write) ? policy.write["not-allow"] : policy.write["allow"]
      setPlist(content)
    }

  },[tab])
  async function savePolicy(){
    console.log(tab)
    console.log(checked)
    console.log(plist)
    const sp = await setPolicy(tab, checked);
    console.log(sp, "sp")
    const list = await setPolicyList(tab, plist)
    console.log(list, "list")
  }

  return (
    <div id="main-column">
    <header>
        <h4 id="column-title">Settings</h4>
      </header>
      <div id="policy">
        <div className="tab-selector">
          <p className={tab == "read" ? "active" : ""} onClick={()=> setTab("read")}>Read</p>
          <p className={tab == "read" ? "" : "active"} onClick={()=> setTab("write")}>Write</p>
          </div>
        <div id="tab">
          <h3>{tab == "read" ? "Read" : "Write"} Permissions</h3>
          <div className="input">
          <p>Limit people who can  
            {tab == "read" ? " read " : " write to "}
            your feed?</p>
          <input type="checkbox" 
          checked={checked}
          onChange={()=> setChecked(!checked)}
          />
          </div>
          <div className="input">
          <p>Set a {checked ? "black" : "white"}list</p>
          <textarea name="" id=""
          value={plist.join("\n")}
          onChange={e => setPlist(e.target.value.split("\n"))}
          ></textarea>
          </div>
          </div>
        <button onClick={savePolicy}>Save</button>
        </div>
    </div>
  );
}

export default Policy;
