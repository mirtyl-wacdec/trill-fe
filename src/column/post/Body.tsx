import Markdown from "marked-react";
import useLocalState from "../../logic/state";
import type { Content } from "../../logic/types";
interface BodyProps {
  contents: Content[];
}
function Body({ contents }: BodyProps) {
  const { scryFeed } = useLocalState();
  function load_user() {}
  return (
    <div className="body">
      {contents.map((c, i) => {
        if ("text" in c)
          return (
              <Markdown key={JSON.stringify(c)+ `{${i}}`}>{c.text}</Markdown>
          );
        else if ("mention" in c)
          return (
            <p key={JSON.stringify(c)+ `{${i}}`} className="mention" onClick={() => scryFeed(c.mention)}>
              {c.mention}
            </p>
          );
        else if ("url" in c)
          return (
            <a key={JSON.stringify(c)+ `{${i}}`} href={c.url}>
              {c.url}
            </a>
          );
      })}
    </div>
  );
}

export default Body;
