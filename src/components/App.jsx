import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import Main from "../mainPage/Main";
import MobileWarning from "./MobileWarning";
import "../../public/styles.css";

function App() {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  if (isMobile) {
    return <MobileWarning />;
  }

  return (
    <div className="App">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
