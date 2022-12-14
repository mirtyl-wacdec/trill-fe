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
  const { resetPlayArea} = useLocalState();
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [quote, setQuote2] = useState("");
  const [button, setButton] = useState("Post");
  const [canPost, setCanPost] = useState(true);


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
    setButton("...");
    setCanPost(false);
    const contents = tokenize(text);
    const imgs = images.map((i) => {
      return { url: i };
    });
    const withMedia = [...contents, ...imgs];
    if (pr.interaction === "reply") poastReply(withMedia);
    else if (pr.interaction === "quote") poastQuote(withMedia);
    //    quit();
  }
  async function poastReply(c: Content[]) {
    const r = await addPost(c, pr.node);
    if (r) success();
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
    const contents = [...c, ref];
    const r = await addPost(contents, undefined);
    if (r) success();
  }
  function success() {
    setText("");
    setVideo("");
    setAudio("");
    setImages([]);
    setButton("OK");
    setTimeout(() => {
      setCanPost(true)
      setButton("Post")
    }, 2000);
  }
  function handlePaste(d: any) {
    if (d.clipboardData.files[0]) {
      setFiles(d.clipboardData.files);
      // upload_file();
    } else {
      return;
    }
  }

  return (
    <div className="composer">
      <div className="composer-title playmenu-title">
      <p className="close-composer"
        onClick={() => {
          resetPlayArea()
        }}
      >
        x
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
            {/* <img className="clickable" src={add_image} alt="" /> */}
            {/* <img className="clickable" src={emoji} alt="" /> */}
            <button onClick={poast} disabled={!canPost} className="post-button clickable">
            {button}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
