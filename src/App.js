import React from "react";
import "./App.css";
import Ticker from "./components/Ticker/ticker";
import "rsuite/dist/rsuite.css";
import Bids from "./components/Bids/bids";

const App = () => {
  return (
    <div className="main">
      <Ticker />
      <Bids />
    </div>
  );
};

export default App;
