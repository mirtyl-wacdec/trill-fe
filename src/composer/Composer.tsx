import { useState, useRef, useEffect } from "react";
import Post from "../column/post/Post";
import { addPost } from "../logic/actions";
import { tokenize } from "../logic/utils";
interface ComposerProps{
  quit: () => void
}
function Composer({quit}: ComposerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [poking, setPoking] = useState(false);
  const [replying, setReplying] = useState(null);
  const [video, setVideo] = useState("");
  const [audio, setAudio] = useState("");
  const [images, setImages] = useState<string[]>([]);
  useEffect(()=>{
    const checkIfClickedOutside = (e: any) => {
      if (ref.current && !ref.current.contains(e.target)) quit();
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [])


  function popImg(url: string) {
    setImages((i) => i.filter((img) => img !== url));
  }
  async function poast() {
    setPoking(true);
    const contents = tokenize(text);
    console.log(contents)
    const r = await addPost(contents, null);
    console.log(r);
  }

  function handlePaste(d: any) {
    if (d.clipboardData.files[0]) {
      setFiles(d.clipboardData.files);
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
          onChange={(e) => setText(e.target.value)}
          name=""
          id=""
          minLength={1}
          maxLength={256}
        />
      </div>
      <div className="media-preview">
        {video.length && (
          <video
            onClick={() => setVideo("")}
            className="vid-preview"
            src={video}
          />
        )}
        {audio.length && (
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
              onClick={() => popImg(img)}
              className="img-preview"
              src={img}
              alt=""
            />
          );
        })}
      </div>
      <footer>
        <button disabled={poking} onClick={poast}>
          Poast
        </button>
      </footer>
    </div>
  );
}

export default Composer;
