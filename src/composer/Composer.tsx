import { useState, useRef, useEffect } from "react";
import Post from "../column/post/Post";
import { addPost } from "../logic/actions";
import { tokenize } from "../logic/utils";
import {
  AUDIO_REGEX,
  VIDEO_REGEX,
  TWITTER_REGEX,
  REF_REGEX,
  IMAGE_REGEX
} from "../logic/regex";
interface ComposerProps {
  quit: () => void;
}
function Composer({ quit }: ComposerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [poking, setPoking] = useState(false);
  const [replying, setReplying] = useState(null);
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [quote, setQuote] = useState("");
  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) quit();
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, []);

  function popImg(which: number) {
    setImages((i) => i.filter((img, ind) => ind !== which));
  }
  async function poast() {
    setPoking(true);
    const contents = tokenize(text);
    const r = await addPost(contents, null);
    quit();
  }

  function handleChange(e: any){
    const img = e.target.value.match(IMAGE_REGEX);
    const aud = e.target.value.match(AUDIO_REGEX);
    const vid = e.target.value.match(VIDEO_REGEX);
    const tw = e.target.value.match(TWITTER_REGEX);
    const ref = e.target.value.match(REF_REGEX);
    if (img) handleImage(img)
    else if (vid) setVideo(vid[0]);
    else if (aud) setAudio(aud[0])
    else if (tw) setQuote(tw)
    else if(ref) setQuote(ref)
    else setText(e.target.value);
  }

  function handleImage(matches: string[]){
    if (images.length < 9)
    setImages(state => [...state, ...matches])
  }

  function handlePaste(d: any) {
    if (d.clipboardData.files[0]) {
      setFiles(d.clipboardData.files);
      console.log(d, "d")
      console.log(files, "files")
      // upload_file();
    } else {
      return;
    }
  }
  // async function upload_file() {
  //   setLoading(true)
  //   const data = new FormData();
  //   for (const f of files) {
  //     data.append("files[]", f, f.name);
  //   }
  //   const res = await uploadFile(data);
  //   for (let f of res) {
  //     addPic(f);
  //   }
  //   setLoading(false);
  // };
  return (
    <div ref={ref} id="composer">
      <div className="textarea">
        {/* {replying && (
        <div className="replying_to">
          <Post node={replying} quote={true} />
        </div>
      )} */}
        <textarea
          onPaste={handlePaste}
          value={text}
          onInput={handleChange}
          name=""
          id=""
          minLength={1}
          maxLength={256}
        />
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
      </div>
      <footer>
        <button disabled={poking} onClick={poast}>
          Poast
        </button>
        <p>{text.length}/256</p>
      </footer>
    </div>
  );
}

export default Composer;
