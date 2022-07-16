import Sigil from "../ui/Sigil";
import { useState } from "react";
import add_image from "../icons/add_image.svg";
import emoji from "../icons/emoji.png";
import { addPost } from "../logic/actions";
import { tokenize, nodeToText } from "../logic/utils";
import {
  AUDIO_REGEX,
  VIDEO_REGEX,
  TWITTER_REGEX,
  REF_REGEX,
  IMAGE_REGEX,
} from "../logic/regex";
import useLocalState from "../logic/state";
import type { Node, Content, ReferenceContent } from "../logic/types";
interface ComposerProps {
  node: Node;
  interaction: "reply" | "quote";
}

export default function (pr: ComposerProps) {
  const { our, setReply, setQuote } = useLocalState();
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [poking, setPoking] = useState(false);
  const [replying, setReplying] = useState(null);
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [quote, setQuote2] = useState("");

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const img = e.target.value.match(IMAGE_REGEX);
    const aud = e.target.value.match(AUDIO_REGEX);
    const vid = e.target.value.match(VIDEO_REGEX);
    const tw = e.target.value.match(TWITTER_REGEX);
    const ref = e.target.value.match(REF_REGEX);
    if (img) handleImage(img);
    else if (vid) setVideo(vid[0]);
    else if (aud) setAudio(aud[0]);
    else if (tw) setQuote2(tw[0]);
    else if (ref) setQuote2(ref[0]);
    else if (e.target.value.length < 257) setText(e.target.value);
  }
  function handleImage(matches: string[]) {
    if (images.length < 9) setImages((state) => [...state, ...matches]);
  }
  function popImg(which: number) {
    setImages((i) => i.filter((img, ind) => ind !== which));
  }
  function poast() {
    setPoking(true);
    const contents = tokenize(text);
    const imgs = images.map((i) => {
      return { url: i };
    });
    console.log(contents, "contents posted");
    const withMedia = [...contents, ...imgs];
    if (pr.interaction === "reply") poastReply(withMedia);
    else if (pr.interaction === "quote") poastQuote(withMedia);
    //    quit();
  }
  async function poastReply(c: Content[]) {
    const r = await addPost(c, pr.node);
    console.log(r, "r");
    if (r) reset();
  }
  async function poastQuote(c: Content[]) {
    const q = pr.node;
    const ref: ReferenceContent = {
      reference: {
        feed: {
          id: q.id,
          host: q.post.host,
        },
      },
    };
    const contents = [ref, ...c];
    const r = await addPost(contents, undefined);
    console.log(r, "r");
    if (r) reset();
  }
  function reset() {
    setText("");
    setVideo("");
    setAudio("");
    setImages([]);
  }
  function handlePaste(d: any) {
    if (d.clipboardData.files[0]) {
      setFiles(d.clipboardData.files);
      console.log(d, "d");
      console.log(files, "files");
      // upload_file();
    } else {
      return;
    }
  }

  return (
    <div className="composer">
      <div className="composer-title">
      <p
        onClick={() => {
          setReply(null), setQuote(null);
        }}
      >
        (x)
      </p>
      <p>
      {pr.interaction === "reply" 
        ? `Replying to ${pr.node.post.author}`
        : `Quoting ${pr.node.post.author}`
        }
      </p>
      </div>

      <div className="textarea">
        <textarea
          value={text}
          placeholder="Type here"
          onInput={handleInput}
        ></textarea>
        <div id="media-preview">
          {!!video.length && (
            <video
              onClick={() => setVideo("")}
              className="vid-preview"
              src={video}
            />
          )}
          {!!audio.length && (
            <audio
              onClick={() => setAudio("")}
              className="aud-preview"
              src={video}
            />
          )}
          {images.map((img, i) => {
            return (
              <img
                id={`prev-${i}`}
                key={`${img}-${i}`}
                onClick={() => popImg(i)}
                className={`img-preview prevs-${images.length}`}
                src={img}
                alt=""
              />
            );
          })}
        </div>

        <div className="composer-footer">
          <p>
            {text.length}/{256}
          </p>
          <div className="composer-icons">
            <img className="clickable" src={add_image} alt="" />
            {/* <img className="clickable" src={emoji} alt="" /> */}
            <button onClick={poast} className="clickable">
              Poast
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
interface ReplyProps {
  r: Node;
}
function Reply({ r }: ReplyProps) {
  return (
    <div className="reply-in-composer">
      <p className="reply-metadata">Replying to: {r.post.author}</p>
      <p className="reply-text">{nodeToText(r)}</p>
    </div>
  );
}
interface QuoteProps {
  q: Node;
}
function Quote({ q }: QuoteProps) {
  console.log(q, "q");
  return (
    <div className="quote-in-composer">
      <p className="quote-metadata">{q.post.author}</p>
      <p className="quote-text">{nodeToText(q)}</p>
    </div>
  );
}
