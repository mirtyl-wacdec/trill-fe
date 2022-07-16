import { useState, useEffect } from "react";
import useLocalState from "../../logic/state";

export default function () {
  const { scryFeed, activeGraph, activeFeed } = useLocalState();
  useEffect(() => {
  }, []);
  return (
    <div id="main-column">
      <header>
        <h4 id="column-title">Twitter Client</h4>
      </header>
    </div>
  );
}
