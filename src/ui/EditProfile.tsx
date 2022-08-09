import Sigil from "./Sigil";
import useLocalState from "../logic/state";
import { useState, useEffect } from "react";
import {
  fetchContact,
  follow,
  unfollow,
  sendDM,
  begForInvite,
  editContact,
} from "../logic/actions";
import Spinner from "./Spinner";
import { useNavigate } from "react-router-dom";

interface UserPreviewProps {
  patp: string;
}
export default function () {
  let navigate = useNavigate();
  const { our } = useLocalState();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [nick, setNick] = useState("");
  const [avatar, setAvatar] = useState("");
  const [cover, setCover] = useState("");
  const [color, setColor] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(false);
  const [button, setButton] = useState("Save");

  useEffect(() => {
    setError(false);
    fetchContact(our)
      .then((res) => {
        const c = res["contact-update"].add.contact;
        if (c.status) setStatus(c.status);
        if (c.nickname) setNick(c.nickname);
        if (c.avatar) setAvatar(c.avatar);
        if (c.cover) setCover(c.cover);
        if (c.color) setColor(c.color);
        if (c.bio) setBio(c.bio);
      })
      .catch((err) => {
        setBio("");
      });
  }, []);
  //   {
  //     "add": {
  //         "ship": "zod",
  //         "contact": {
  //             "status": "",
  //             "last-updated": 946684800000,
  //             "avatar": null,
  //             "cover": null,
  //             "bio": "",
  //             "nickname": "",
  //             "color": "0x0",
  //             "groups": []
  //         }
  //     }
  // }
  function openFeed() {
    navigate(`/home}`);
  }
  async function saveProfile(){
    const res = await editContact(status, nick, avatar, cover, color, bio)
    if (res) setButton("Saved!")
  }
  return (
    <div id="edit-profile">
      <div className="metadata">
        <div className="sigil">
          <Sigil patp={our} size={30} />
        </div>
        <div className="patp">
          <p onClick={openFeed} className="clickable patp-string">
            {our}
          </p>
        </div>
      </div>
      <div className="playmenu-title">
      <h4>Edit Profile</h4>
      <button onClick={saveProfile}>{button}</button>
      </div>
      <div className="input">
        <label>Status</label>
        <input
          value={status}
          onChange={(e) => setStatus(e.currentTarget.value)}
          type="text"
        />
      </div>
      <div className="input">
        <label>Nickname</label>
        <input
          value={nick}
          onChange={(e) => setNick(e.currentTarget.value)}
          type="text"
        />
      </div>

      <div className="input">
        <label>Avatar</label>
        <input
          value={avatar}
          onChange={(e) => setAvatar(e.currentTarget.value)}
          type="text"
        />
      </div>
      <div className="input">
        <label>Cover</label>
        <input
          value={cover}
          onChange={(e) => setCover(e.currentTarget.value)}
          type="text"
        />
      </div>
      {/* <div className="input">
        <label>Sigil color</label>
        <input
          value={color}
          onChange={(e) => setColor(e.currentTarget.value)}
          type="text"
        />
      </div> */}
      <div className="input">
        <label>Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.currentTarget.value)}
          name=""
          id=""
        ></textarea>
      </div>
    </div>
  );
}
