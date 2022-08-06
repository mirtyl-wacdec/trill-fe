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
  const { our, following, setPreview } = useLocalState();
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
  }
  async function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
    const f = Array.from(following).filter(f => e.target.value !== "" && f.includes(e.target.value));
    const valid = isValidPatp(e.target.value) ? [e.target.value] : []
    setCandidates([... new Set([...f, ...valid])]);
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
  return(
    <div onClick={() => select(patp)} className="candidate clickable">
      <div className="sigil">
      <Sigil patp={patp} size={32}/>
      </div>
     <p className="candidate-patp">{patp}</p>
    </div>
  )
}