import Markdown from "marked-react";
import { useNavigate } from "react-router-dom";
import useLocalState from "../../logic/state";
import type {
  Node,
  Content,
  FeedReference,
  ReferenceContent,
  URLContent,
} from "../../logic/types";
import {
  AUDIO_REGEX,
  VIDEO_REGEX,
  TWITTER_REGEX,
  REF_REGEX,
  IMAGE_REGEX,
} from "../../logic/regex";
import { useState, useEffect } from "react";
import { scryNodeFlat } from "../../logic/actions";
interface BodyProps {
  contents: Content[];
}
function Body({ contents }: BodyProps) {
  const [quote, setQuote] = useState<Node | null>(null);
  const [badQuote, setBadQuote] = useState("");
  useEffect(() => {
    let mounted = true;
    const ref = contents.find((c) => "reference" in c);
    if (ref) {
      const r = ref as ReferenceContent;
      const rr = r.reference as FeedReference;
      scryNodeFlat(rr.feed.host, rr.feed.id).then((res) => {
        if (res && "flat-node-scry" in res) setQuote(res["flat-node-scry"]);
        else if (res && "not-follow" in res) setBadQuote(rr.feed.host)
      });
    }
    return () => {
      mounted = false;
    };
  }, [contents]);
  const { scryFeed, setPreview } = useLocalState();
  function isMedia(c: Content): c is URLContent {
    return "url" in c && !!c.url.match(IMAGE_REGEX);
  }
  const media: URLContent[] = contents.filter(isMedia);
  const text = contents.filter((c) => {
    return !("url" in c && c.url.match(IMAGE_REGEX));
  });
  return (
    <div className="body">
      <div className="body-text">
        {text.map((c, i) => {
          if ("text" in c)
            return (
              <Markdown key={JSON.stringify(c) + `{${i}}`}>{c.text}</Markdown>
            );
          else if ("mention" in c)
            return (
              <p
                key={JSON.stringify(c) + `{${i}}`}
                className="mention"
                onClick={() => scryFeed(c.mention)}
              >
                {c.mention}
              </p>
            );
          else if ("url" in c)
            return (
              <a key={JSON.stringify(c) + `{${i}}`} href={c.url}>
                {c.url}
              </a>
            );
          else if ("json" in c)
            return (
              <p
                key={JSON.stringify(c.json)}
                className="external-content-warning"
              >
                External content from "{c.json.origin}", use
                <a href="">UFA</a>
                to display.
              </p>
            );
        })}
      </div>
      <div className="body-media">
        {media.map((m, i) => {
          return (
            <img
              key={m.url + i}
              className={`body-img body-img-1-of-${media.length}`}
              src={m.url}
              alt=""
            />
          );
        })}
      </div>
      {quote && <Quote q={quote} />}
      {!!badQuote.length && 
      <div className="quote-in-post">
        <p className="bad-quote">Quoting post by 
        <span onClick={()=> setPreview(badQuote)}
        className="repostee">{badQuote}, 
        </span>
        who you do not follow</p>
      </div>
      }
    </div>
  );
}

export default Body;
interface QuoteProps {
  q: Node;
}
function Quote({ q }: QuoteProps) {
  const tombstoned = typeof q.post === "string";
  if (tombstoned)
    return (
      <div className="post deleted-post">
        <p>Deleted post</p>
      </div>
    );
  else {
    let navigate = useNavigate();
    const contents = q.post.contents;
    const { scryFeed } = useLocalState();
    function isMedia(c: Content): c is URLContent {
      return "url" in c && !!c.url.match(IMAGE_REGEX);
    }
    const media: URLContent[] = contents.filter(isMedia);
    const text = contents.filter((c) => {
      return !("url" in c && c.url.match(IMAGE_REGEX));
    });
    const gotoQuote = () => {
      navigate(`/${q.post.host}/${q.id}`);
    };
    return (
      <div onClick={gotoQuote} className="quote-in-post">
        <header>{q.post.author}</header>
        <div className="body">
          <div className="body-text">
            {text.map((c, i) => {
              if ("text" in c)
                return (
                  <Markdown key={JSON.stringify(c) + `{${i}}`}>
                    {c.text}
                  </Markdown>
                );
              else if ("mention" in c)
                return (
                  <p
                    key={JSON.stringify(c) + `{${i}}`}
                    className="mention"
                    onClick={() => scryFeed(c.mention)}
                  >
                    {c.mention}
                  </p>
                );
              else if ("url" in c)
                return (
                  <a key={JSON.stringify(c) + `{${i}}`} href={c.url}>
                    {c.url}
                  </a>
                );
            })}
          </div>
          <div className="body-media">
            {media.map((m, i) => {
              return (
                <img
                  key={m.url + i}
                  className={`body-img body-img-1-of-${media.length}`}
                  src={m.url}
                  alt=""
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
