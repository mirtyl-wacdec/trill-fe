import { useState, useEffect } from "react";
import useLocalState from "./logic/state";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Leftbar from "./left/Leftbar";
import Home from "./column/Home";
import Timeline from "./column/Timeline";
import Policy from "./column/Policy";
import Notifications from "./column/Notifications";
import Lists from "./column/Lists";
import List from "./column/List";
import User from "./column/User";
import Thread from "./column/Thread";
import Composer from "./composer/Composer";
import PlayArea from "./playground/PlayArea";

function App() {
  const [writing, setWriting] = useState(false);
  const {
    airlock,
    scryPolicy,
    scryFeed,
    scryFollows,
    subscribeFeed,
    subscribeHark,
  } = useLocalState();
  useEffect(() => {
    console.log(airlock, "airlock");
    scryPolicy();
    subscribeFeed();
    // scryFollows();
  }, []);
  return (
    <div className="App">
      <BrowserRouter>
        <Leftbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="timeline" element={<Timeline />} />
            <Route path="home" element={<Home />} />
            <Route path="policy" element={<Policy />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="lists" element={<Lists />}>
              <Route path=":listname" element={<List />} />
            </Route>
          </Routes>
          <PlayArea />
      </BrowserRouter>
      {/* <PlayArea /> */}
    </div>
  );
}

export default App;
