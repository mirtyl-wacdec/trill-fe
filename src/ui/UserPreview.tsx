import Sigil from "../ui/Sigil";
import useLocalState from "../logic/state";
import { useState, useEffect } from "react";
import { fetchContact, follow, unfollow, sendDM } from "../logic/actions";
import Spinner from "../ui/Spinner";
import { useNavigate } from "react-router-dom";

interface UserPreviewProps {
  patp: string;
}
export default function ({ patp }: UserPreviewProps) {
  let navigate = useNavigate();
  const { scryFollows, fans, follows, follow_attempts } = useLocalState();
  const [loading, setLoading] = useState(false);
  console.log(fans, "fans");
  console.log(follows, "follows");
  const [bio, setBio] = useState("");
  const [error, setError] = useState(false);
  const [DMSent, setDMSent] = useState(false);
  useEffect(() => {
    setError(false);
    setBio("");
    fetchContact(patp)
      .then((res) => {
        setBio(res["contact-update"].add.contact.bio);
        console.log(res, "contact");
      })
      .catch((err) => {
        setBio("");
      });
  }, [patp]);
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
  async function startUnfollow() {
    setLoading(true);
    const res = await unfollow(patp);
    if (res) scryFollows();
    setLoading(false);
  }
  console.log(follow_attempts, "fa");
  async function startFollow() {
    setLoading(true);
    follow(patp, (data: any) => {
      setTimeout(() => {
        const followed = follow_attempts.find((fa) => {
          const elapsed = Date.now() - fa.timestamp;
          return fa.ship == patp //&& elapsed < 100000;
        });
        console.log(followed, "f");
        if (followed) {
          scryFollows();
          navigate(`./${patp}`);
        }
        else setError(true);
        setLoading(false);
      }, 5000);
    });
  }

  async function shill() {
    const res = await sendDM(patp);
    if (res) setDMSent(true);
  }
  function promptUnfollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.innerText = "Unfollow";
  }
  function quitPrompt(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.innerText = "Following";
  }
  function openFeed(){
    if (follows.has(patp)) navigate(`./${patp}`);
  }
  return (
    <div className="user-preview">
      <div className="metadata">
        <Sigil patp={patp} size={30} />
        <div className="patp">
          <p onClick={openFeed} className="clickable patp-string">{patp}</p>
          <p className="follows-you">
            {fans.has(patp) ? "Follows you" : "Doesn't follow you"}
          </p>
        </div>
        {loading && (
          <div className="spinner">
            <Spinner size={25} />
          </div>
        )}
        {follows.has(patp) ? (
          <button
            onClick={startUnfollow}
            onMouseOver={promptUnfollow}
            onMouseLeave={quitPrompt}
          >
            Following
          </button>
        ) : (
          <button onClick={startFollow}>Follow</button>
        )}
        <p className="clickable composer-metadata-icon">...</p>
      </div>
      <div className="bio">{!!bio.length ? bio : "No public bio"}</div>
      {error && (
        <div className="follow-error">
          <p>Connection to {patp} timed out.</p>
          <p>He's either offline or does not have Trill installed</p>
          <p>Remind him?</p>
          <button disabled={DMSent} onClick={shill}>
            {DMSent ? "DM Sent" : "Send DM"}
          </button>
        </div>
      )}
      {/* TODO with content distribution
      <div className="user-data">
        <div className="lists clickable">
          <p>Lists</p>
        </div>
        <div className="followers clickable">
          <p>Followers</p>
        </div>
        <div className="following clickable">
          <p>Following</p>
        </div>
      </div> */}
    </div>
  );
}
