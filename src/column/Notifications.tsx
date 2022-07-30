import { useState, useEffect } from "react";
import useLocalState from "../logic/state";
import { FollowNotification, Notification, PID } from "../logic/types";
import { date_diff } from "../logic/utils";
import Sigil from "../ui/Sigil";

function Notifications() {
  const { notifications } = useLocalState();
  const [showUnread, setShowUnread] = useState(false);
  console.log(notifications, "notifications");
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Notifications</h4>
      </header>
      <div id="notifications">
        <div className="news">
          {[...notifications.engagement, ...notifications.follows].map((n) => (
            <Note key={JSON.stringify(n)} n={n} />
          ))}
        </div>
        <div className="unread">
          <p onClick={() => setShowUnread(!showUnread)}>Unread poasts</p>
          {showUnread &&
            notifications.unread.map((pid) => (
              <Pid key={JSON.stringify(pid)} pid={pid} />
            ))}
        </div>
      </div>
    </div>
  );
}

export default Notifications;

interface NoteProps {
  n: Notification | FollowNotification;
}
function Note({ n }: NoteProps) {
  if ("mention" in n)
    return (
      <div className="note react-note">
        <div className="author">
          <div className="sigil">
            <Sigil patp={n.mention.ship} size={30} />
          </div>
          <p className="patp">{n.mention.ship}</p>
        </div>
        <div className="note-content">
          <p className="note-action">Mentioned you</p> 
          <a href={`/${n.mention.pid.host}/${n.mention.pid.id}`}>in this post</a>
        </div>
        <div className="note-time">
          <p>{date_diff(n.mention.time, "short")}</p>
        </div>
      </div>
    );
  else if ("react" in n)
    return (
      <div className="note react-note">
        <div className="author">
          <div className="sigil">
            <Sigil patp={n.react.ship} size={30} />
          </div>
          <p className="patp">{n.react.ship}</p>
        </div>
        <div className="note-content">
          <p className="note-action">Reacted {n.react.react} to{" "}</p> 
          <a href={`/${n.react.pid.host}/${n.react.pid.id}`}>your post</a>
        </div>
        <div className="note-time">
          <p>{date_diff(n.react.time, "short")}</p>
        </div>
      </div>
    );
  else if ("reply" in n)
    return (
      <div className="note reply-note">
        <div className="author">
          <div className="sigil">
            <Sigil patp={n.reply.ship} size={30} />
          </div>
          <p className="patp">{n.reply.ship}</p>
        </div>
        <div className="note-content">
          <a  className="note-action" href={`${n.reply.ab.host}/${n.reply.ab.id}`}>replied here</a>
          <a href={`${n.reply.ad.host}/${n.reply.ad.id}`}>to your post</a>
        </div>
        <div className="note-time">
          <p>{date_diff(n.reply.time, "short")}</p>
        </div>
      </div>
    );
  else if ("quote" in n)
    return (
      <div className="note quote-note">
        <div className="author">
          <div className="sigil">
            <Sigil patp={n.quote.ship} size={30} />
          </div>
          <p  className="patp">{n.quote.ship}</p>
        </div>
        <div className="note-content">
          <a  className="note-action" href={`${n.quote.ab.host}/${n.quote.ab.id}`}>quoted here</a>
          <a href={`${n.quote.ad.host}/${n.quote.ad.id}`}>your post</a>
        </div>
        <div className="note-time">
          <p>{date_diff(n.quote.time, "short")}</p>
        </div>
      </div>
    );
  else if ("rt" in n)
    return (
      <div className="note repost-note">
        <div className="author">
          <div className="sigil">
            <Sigil patp={n.rt.ship} size={30} />
          </div>
          <p  className="patp">{n.rt.ship}</p>
        </div>
        <div className="note-content">
          <a  className="note-action" href={`${n.rt.ab.host}/${n.rt.ab.id}`}>reposted here</a>
          <a href={`${n.rt.ad.host}/${n.rt.ad.id}`}>your post</a>
        </div>
        <div className="note-time">
          <p>{date_diff(n.rt.time, "short")}</p>
        </div>
      </div>
    );
  else return <></>;
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
