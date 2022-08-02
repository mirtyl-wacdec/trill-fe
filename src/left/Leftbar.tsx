import { Link } from "react-router-dom";
import home from "../icons/home.svg";
import head from "../icons/head.svg";
import lists from "../icons/lists.svg";
import dms from "../icons/dms.svg";
import notes from "../icons/notes.svg";
import settings from "../icons/settings.svg";
import pals from "../icons/pals.svg";
import twatter from "../icons/twatter.svg";
import { useState } from "react";
import MiniComposer from "../ui/MiniComposer";
import Searchbox from "../ui/Searchbox";

function Leftbar() {
  return (
    <div id="leftbar">
      <div id="main-icons applet">
        <h4>Trill</h4>
        <Link className="link" to="/timeline">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={home} alt="" />
            <p>Timeline</p>
          </div>
        </Link>
        <Link className="link" to="/home">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={head} alt="" />
            <p>Home</p>
          </div>
        </Link>
        <Link className="link" to="/lists">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={lists} alt="" />
            <p>Lists</p>
          </div>
        </Link>
        <Link className="link" to="/policy">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={settings} alt="" />
            <p>Settings</p>
          </div>
        </Link>
        <Link className="link" to="/messages">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={dms} alt="" />
            <p>Messages</p>
          </div>
        </Link>
        <Link className="link" to="/notifications">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={notes} alt="" />
            <p>Notifications</p>
          </div>
        </Link>
      </div>

      <div className="composer-container applet">
        <div className="title">
          <p>You</p>
          <p className="bar"></p>
        </div>
        <MiniComposer />
      </div>
      {/* <div className="app-drawer applet">
        <div className="title">
          <p>Apps</p>
          <p className="bar"></p>
        </div>
      </div> */}
      <Link className="link" to="/version">
        <div className="footer">
          <p>Trill</p>
          <p className="version">0.1.4</p>
        </div>
      </Link>
    </div>
  );
}

export default Leftbar;
