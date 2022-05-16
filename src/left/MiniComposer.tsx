import Sigil from "../ui/Sigil";
import { useState } from "react";
import add_image from "../icons/add_image.svg";
import emoji from "../icons/emoji.png";
import { addPost } from "../logic/actions";
import { tokenize } from "../logic/utils";
import {
  AUDIO_REGEX,
  VIDEO_REGEX,
  TWITTER_REGEX,
  REF_REGEX,
  IMAGE_REGEX,
} from "../logic/regex";

export default function () {
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [poking, setPoking] = useState(false);
  const [replying, setReplying] = useState(null);
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [quote, setQuote] = useState("");

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    const img = e.target.value.match(IMAGE_REGEX);
    const aud = e.target.value.match(AUDIO_REGEX);
    const vid = e.target.value.match(VIDEO_REGEX);
    const tw = e.target.value.match(TWITTER_REGEX);
    const ref = e.target.value.match(REF_REGEX);
    if (img) handleImage(img);
    else if (vid) setVideo(vid[0]);
    else if (aud) setAudio(aud[0]);
    else if (tw) setQuote(tw[0]);
    else if (ref) setQuote(ref[0]);
    else if (e.target.value.length < 257) setText(e.target.value);
  }
  function handleImage(matches: string[]) {
    if (images.length < 9) setImages((state) => [...state, ...matches]);
  }
  function popImg(which: number) {
    setImages((i) => i.filter((img, ind) => ind !== which));
  }
  async function poast() {
    setPoking(true);
    const contents = tokenize(text);
    const imgs = images.map(i => {
      return {url: i}
    })
    console.log(contents, "contents posted");
    const withMedia = [...contents, ...imgs]
    const r = await addPost(withMedia, null);
    console.log(r, "r");
    if (r) reset();
    //    quit();
  }
  function reset(){
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
      <div className="metadata">
        <Sigil patp={"~zod"} size={30} />
        <div className="patp">
          <p className="patp-string">~zod</p>
          <p className="clickable">Edit Profile</p>
        </div>
        <p className="clickable composer-metadata-icon">...</p>
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
