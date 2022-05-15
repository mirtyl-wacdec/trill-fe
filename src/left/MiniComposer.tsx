import Sigil from "../ui/Sigil";
import { useState } from "react";
import add_image from "../icons/add_image.svg";
import emoji from "../icons/emoji.png";

export default function () {
  const [text, setText] = useState("");
  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    // TODO
    if ((e.target.value.length) < 257)
    setText(e.target.value)
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
          onChange={handleInput}
        ></textarea>
        <div className="composer-footer">
          <p>
            {text.length}/{256}
          </p>
          <div className="composer-icons">
            <img className="clickable" src={add_image} alt="" />
            <img className="clickable" src={emoji} alt="" />
            <button className="clickable">Poast</button>
          </div>
        </div>
      </div>
    </div>
  );
}
