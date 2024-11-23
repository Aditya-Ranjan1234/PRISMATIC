import React from "react";
import "../public/Main.css";
import Uploader from "./Uploader";
import RandomIcons from "../../src/RandomIcons";

function Main() {
  return (
    <div className="Main">
      <RandomIcons />
      <div className="content-wrapper">
        <div className="text-container">
          <h1 className="display-4 fst-italic">
            Your Image, Your Rights: Know What You're Sharing.
          </h1>
          <p className="lead my-3">
            Every photo has a story. Ensure it’s a story worth telling. Worried
            about privacy violations? Let our scanning technology identify
            potential ethical issues in your images.
          </p>
        </div>
        <div className="uploader-container">
          <Uploader />
        </div>
      </div>
    </div>
  );
}

export default Main;
