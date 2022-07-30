import { useState, useEffect } from "react";
import useLocalState from "./logic/state";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Leftbar from "./left/Leftbar";
import Home from "./column/Home";
import User from "./column/User";
import Timeline from "./column/Timeline";
import Policy from "./column/Policy";
import Messages from "./column/Messages";
import DM from "./column/DM";
import Notifications from "./column/Notifications";
import Lists from "./column/Lists";
import AddToList from "./column/lists/AddtoList";
import ListFeed from "./column/lists/ListFeed";
import ListContents from "./column/lists/ListContents";
import Thread from "./column/Thread";
import Twatter from "./apps/twatter/Index";
import PlayArea from "./playground/PlayArea";
import Error from "./errors/404";

function App() {
  const [writing, setWriting] = useState(false);
  const {
    init,
    airlock,
    scryPolicy,
    scryFeed,
    scryFollows,
    scryLists,
    subscribeFeed,
    subscribeHark,
    subscribeJoins
  } = useLocalState();
  useEffect(() => {
    init(),
    console.log(airlock, "airlock");
    scryPolicy();
    scryLists();
    subscribeFeed();
    subscribeHark();
    // scryFollows();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Leftbar />
        <Routes>
          <Route path="/" element={<Timeline />} />
          <Route path="timeline" element={<Timeline />} />
          <Route path="home" element={<Home />} />
          <Route path="policy" element={<Policy />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:patp" element={<DM />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="lists" element={<Lists />} />
          <Route path="lists/:listname" element={<ListFeed />} />
          <Route path="lists/add/:patp" element={<AddToList />} />
          <Route path="lists/members/:listname" element={<ListContents />} />
          <Route path="apps/twitter" element={<Twatter />} />
          <Route path={`~:username`} element={<User />} />
          <Route path={`~:username/:id`} element={<Thread />} />
          <Route path=":else" element={<Error />} />
        </Routes>
        <PlayArea />
      </BrowserRouter>
      {/* <PlayArea /> */}
    </div>
  );
}

export default App;