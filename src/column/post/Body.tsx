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
      {contents.map((c) => {
        if ("text" in c)
          return (
              <Markdown>{c.text}</Markdown>
          );
        else if ("mention" in c)
          return (
            <p className="mention" onClick={() => scryFeed(c.mention)}>
              {c.mention}
            </p>
          );
        else if ("url" in c)
          return (
            <a href={c.url}>
              {c.url}
            </a>
          );
      })}
    </div>
  );
}

export default Body;
