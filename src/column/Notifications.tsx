import { useState, useEffect } from "react";
import { wipeNotes, dismissNote } from "../logic/actions";
import useLocalState from "../logic/state";
import {
  FollowNotification,
  Notification,
  PID,
  UnfollowNotification,
} from "../logic/types";
import { date_diff } from "../logic/utils";
import Sigil from "../ui/Sigil";

function Notifications() {
  const { notifications, scryHark, setPreview } = useLocalState();
  const [showUnread, setShowUnread] = useState(false);
  async function wipe() {
    const res = await wipeNotes();
    console.log(res, "wiped");
    if (res) scryHark();
  }
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Notifications</h4>
        <button onClick={wipe}>Wipe</button>
      </header>
      <div id="notifications">
        <div className="news">
          {[
            ...notifications.engagement,
            ...notifications.follows,
            ...notifications.unfollows,
          ].map((n) => (
            <Note key={JSON.stringify(n)} n={n} />
          ))}
        </div>
        {!!notifications.unread.length && (
          <div className="unread">
            <p onClick={() => setShowUnread(!showUnread)}>Unread poasts</p>
            {showUnread &&
              notifications.unread.map((pid) => (
                <Pid key={JSON.stringify(pid)} pid={pid} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;

interface NoteProps {
  n: Notification;
}
function Note({ n }: NoteProps) {
  const { scryHark, setPreview } = useLocalState();
  const [note, ship, time] =
    "follow" in n ? (
      [<div className="note-content">Followed you</div>, n.follow.ship, n.follow.time]
    ) : "unfollow" in n ? (
      [<div className="note-content">Unfollowed you</div>, n.unfollow.ship, n.unfollow.time]
    ) : "mention" in n ? (
      [<div className="note-content">
        <p className="note-action">Mentioned you</p>
        <a href={`${n.mention.pid.host}/${n.mention.pid.id}`}>in this post</a>
      </div>, n.mention.ship, n.mention.time]
    ) : "react" in n ? (
      [<div className="note-content">
        <p className="note-action">Reacted {n.react.react} to </p>
        <a href={`${n.react.pid.host}/${n.react.pid.id}`}>your post</a>
      </div>, n.react.ship, n.react.time]
    ) : "reply" in n ? (
      [<div className="note-content">
        <a className="note-action" href={`${n.reply.ad.host}/${n.reply.ad.id}`}>
          replied here
        </a>
        <a href={`${n.reply.ab.host}/${n.reply.ab.id}`}>to your post</a>
      </div>, n.reply.ship, n.reply.time]
    ) : "quote" in n ? (
      [<div className="note-content">
        <a className="note-action" href={`${n.quote.ad.host}/${n.quote.ad.id}`}>
          quoted here
        </a>
        <a href={`${n.quote.ab.host}/${n.quote.ab.id}`}>your post</a>
      </div>, n.quote.ship, n.quote.time]
    ) : "rt" in n ? (
      [<div className="note-content">
        <a className="note-action" href={`${n.rt.ad.host}/${n.rt.ad.id}`}>
          reposted here
        </a>
        <a href={`${n.rt.ab.host}/${n.rt.ab.id}`}>your post</a>
      </div>, n.rt.ship, n.rt.time]
    ) : (
      [<></>, "", Date.now()]
    );
  async function closeNote() {
    const res = await dismissNote(n);
    console.log(res, "res");
    if (res) scryHark();
  }
  return (
    <div className="note">
      <div onClick={closeNote} className="close-note">
        x
      </div>
      <div onClick={() => setPreview(ship)} className="author">
        <div className="sigil">
          <Sigil patp={ship} size={30} />
        </div>
        <p className="patp">{ship}</p>
      </div>
      {note}
      <div className="note-time">
        <p>{date_diff(time, "short")}</p>
      </div>
    </div>
  );
}

interface PidProps {
  pid: PID;
}
function Pid({ pid }: PidProps) {
  return (
    <div className="unread">
      <p>{JSON.stringify(pid)}</p>
    </div>
  );
}
