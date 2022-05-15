import { Link } from "react-router-dom";
import home from "../icons/home.svg";
import head from "../icons/head.svg";
import lists from "../icons/lists.svg";
import dms from "../icons/dms.svg";
import notes from "../icons/notes.svg";
import pals from "../icons/pals.svg";
import { useState } from "react";
import MiniComposer from "./MiniComposer";

function Leftbar() {
  return (
    <div id="leftbar">
      <div id="main-icons applet">
        <h4>Trill</h4>
        <Link className="link" to="/timeline">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={home} alt="" />
            <p>Home</p>
          </div>
        </Link>
        <Link className="link" to="/home">
          <div className="left-menu-item">
            <img className="left-menu-icon" src={head} alt="" />
            <p>Your Feed</p>
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
      <div className="app-drawer applet">
        <div className="title">
          <p>Apps</p>
          <p className="bar"></p>
        </div>
      </div>
      <div className="composer-container applet">
        <div className="title">
          <p>You</p>
          <p className="bar"></p>
        </div>
        <MiniComposer />
      </div>
      <div className="footer">
        <p>Trill</p>
        <p className="version">0.1.0</p>
      </div>
    </div>
  );
}

export default Leftbar;
