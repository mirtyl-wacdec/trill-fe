import Markdown from "marked-react";
import useLocalState from "../../logic/state";
import type { Content, URLContent } from "../../logic/types";
import {
  AUDIO_REGEX,
  VIDEO_REGEX,
  TWITTER_REGEX,
  REF_REGEX,
  IMAGE_REGEX,
} from "../../logic/regex";
interface BodyProps {
  contents: Content[];
}
function Body({ contents }: BodyProps) {
  const { scryFeed } = useLocalState();
  function isMedia(c: Content): c is URLContent{
      return "url" in c && !!(c.url.match(IMAGE_REGEX))
  }
  const media: URLContent[] = contents.filter(isMedia);
  const text = contents.filter(c => {
    return !("url" in c && c.url.match(IMAGE_REGEX))
  });
  function load_user() {}
  return (
    <div className="body">
      <div className="body-text">
      {text.map((c, i) => {
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
      <div className="body-media">
        {media.map((m, i) => {
          return <img key={m.url+i} className={`body-img body-img-1-of-${media.length}`} src={m.url} alt="" />
        })}
      </div>
    </div>
  );
}

export default Body;
