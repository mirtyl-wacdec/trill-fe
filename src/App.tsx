import { useState, useEffect } from "react";
import useLocalState from "./logic/state";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import Leftbar from "./left/Leftbar";
import Home from "./column/Home";
import User from "./column/User";
import Timeline from "./column/Timeline";
import Policy from "./column/Policy";
import Notifications from "./column/Notifications";
import Lists from "./column/Lists";
import List from "./column/List";
import Thread from "./column/Thread";
import Composer from "./composer/Composer";
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
    subscribeFeed,
    subscribeHark,
    subscribeJoins
  } = useLocalState();
  useEffect(() => {
    init(),
    console.log(airlock, "airlock");
    scryPolicy();
    subscribeFeed();
    subscribeJoins();
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
          <Route path="notifications" element={<Notifications />} />
          <Route path="lists" element={<Lists />}>
            <Route path=":listname" element={<List />} />
          </Route>
          <Route path={`~:username`} element={<User />} />
          <Route path=":else" element={<Error />} />
        </Routes>
        <PlayArea />
      </BrowserRouter>
      {/* <PlayArea /> */}
    </div>
  );
}

export default App;