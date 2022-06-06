import { Link } from "react-router-dom";
import search from "../icons/search.svg";
import useLocalState from "../logic/state";
import { isValidPatp } from "../logic/ob/co";
import {useState, useEffect} from "react";
import Sigil from "./Sigil";
import {useLocation} from "react-router-dom";

export default function () {
  let loc = useLocation();
  useEffect(()=> setInput(""), [loc])
  const { our, scryFollows, follows, setPreview } = useLocalState();
  const [candidates, setCandidates] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [selected, setSelected] = useState("");
  function select(patp: string){
    setPreview(patp)
    setCandidates([]);
  }

  function searchP(e: React.FormEvent<HTMLFormElement>) {}
  async function handleFocus(){
    setInput("~")
    await scryFollows(); // sets the global variable 'follows'
  }
  async function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    const following = Array.from(follows).filter(f => e.target.value !== "" && f.includes(e.target.value));
    console.log(e.target.value, "value");
    console.log(following, "following");
    const valid = isValidPatp(e.target.value) ? [e.target.value] : []
    setCandidates([... new Set([...following, ...valid])]);
    setPreview("");
  }
  return (
    <div id="search-applet">
    <div onFocus={handleFocus} className="searchbox">
      <form onSubmit={searchP}>
        <input onInput={handleInput} value={input} type="text" placeholder="search for ~" />
        <img className="clickable" src={search} alt="" />
      </form>
    </div>
    {candidates.map(c => <Candidate key={c} patp={c} select={select}/>)}
    </div>
  );
}
interface Candidateprops{
  patp: string;
  select: (patp: string) => void
}
function Candidate({patp, select}: Candidateprops){
  const sigil = patp.length < 15 
  ? <Sigil patp={patp} size={30}/>
  : <Sigil patp={"~zod"} size={30}/>

  return(
    <div onClick={() => select(patp)} className="candidate clickable">
      {sigil}
     <p className="candidate-patp">{patp}</p>
    </div>
  )
}