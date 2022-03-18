import { marked } from 'marked';
import useLocalState from '../../logic/state';
import type {Content} from "../../logic/types";
interface BodyProps{
  contents: Content[]
}
function Body({contents}: BodyProps){
  const {scryFeed} = useLocalState();
  function load_user(){

  }
  return(
  <div className="body">
    {contents.map(c => {
      if ("text" in c)
      return <span>{marked.parse(c.text)}</span>
      else if("mention" in c)
      return <span className="mention" onClick={() => scryFeed("~" + c.mention)}>
      {c.mention}
    </span>
    })}
    </div>
  )
}

export default Body