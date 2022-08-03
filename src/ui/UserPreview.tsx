import Sigil from "../ui/Sigil";
import useLocalState from "../logic/state";
import { useState, useEffect } from "react";
import {
  fetchContact,
  follow,
  unfollow,
  sendDM,
  begForInvite,
} from "../logic/actions";
import Spinner from "../ui/Spinner";
import { useNavigate } from "react-router-dom";

interface UserPreviewProps {
  patp: string;
}
export default function ({ patp }: UserPreviewProps) {
  let navigate = useNavigate();
  const { lists, scryFollows, followers, following, follow_attempts } =
    useLocalState();
  const [loading, setLoading] = useState(false);
  const [bio, setBio] = useState("");
  const [error, setError] = useState(false);
  const [blocked, setBlocked] = useState(false);
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
  async function startFollow() {
    setLoading(true);
    follow(patp, async (data: any) => {
      let acked = false;
      if (data && data !== "trying to follow") {
        acked = true;
        setLoading(false);
        if (data["trill-follow-update"]){
          if (data["trill-follow-update"]["not-allow"]) setBlocked(true)
          else if (data["trill-follow-update"]["allow"]) {
            console.log("allowed!!")
            await scryFollows();
            navigate(`./${patp}`);
          }
        }
      }
      setTimeout(() => {
        if (!acked) {
          setError(true);
          setLoading(false);
        }
      }, 5000);
    });
  }

  async function shill() {
    const res = await sendDM(patp);
    if (res) setDMSent(true);
  }
  async function beg() {
    const res = await begForInvite(patp);
    if (res) setDMSent(true);
  }
  function promptUnfollow(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.innerText = "Unfollow";
  }
  function quitPrompt(e: React.MouseEvent<HTMLButtonElement>) {
    e.currentTarget.innerText = "Following";
  }
  function openFeed() {
    if (following.has(patp)) navigate(`./${patp}`);
  }
  function showListInterface() {
    navigate(`/lists/${patp}`);
  }
  function goToLists(){
    navigate(`/lists/add/${patp}`);
  }
  function goToDMs(){
    navigate(`/messages/${patp}`);
  }
  return (
    <div className="user-preview">
      <div className="metadata">
        <div className="sigil">
          <Sigil patp={patp} size={30} />
        </div>
        <div className="patp">
          <p onClick={openFeed} className="clickable patp-string">
            {patp}
          </p>
          <p className="follows-you">
            {followers.has(patp) ? "Follows you" : "Doesn't follow you"}
          </p>
        </div>
        {loading && (
          <div className="spinner">
            <Spinner size={25} />
          </div>
        )}
        {following.has(patp) ? (
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
        </div>
      )}
      {blocked && (
        <div className="follow-error">
          <p>{patp}'s' feed is locked</p>
          <p>You can request an invite by DM</p>
        </div>
      )}
      <div className="buttons">
        <button onClick={goToLists}>Add to a list</button>
        <button onClick={goToDMs}>Send DM</button>
      </div>

      {/* <div className="user-data">
        <div onClick={showListInterface} className="lists clickable">
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
