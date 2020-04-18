import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeContext } from "../store/ThemeContext";
import Home from "./homepage/Home";
import About from "./aboutpage/About";
import Nav from "./navigation/Nav";

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <div className={`App ${theme}`} style={{ minHeight: "100vh" }}>
      <Router>
        <ThemeContext.Provider value={[theme, setTheme]}>
          <Nav />

          <Route path="/" exact component={Home} />
          <Route path="/about/" exact component={About} />
        </ThemeContext.Provider>
      </Router>
    </div>
  );

  // return (
  //   <div className={`App ${themeClass}`} style={{ minHeight: "100vh" }}>
  // <button onClick={() => setTheme(!theme)}>
  //   {theme ? "Dark theme" : "Light theme"}
  // </button>
  //     <Nav th={(theme, setTheme)} />
  //     <h1>NITK Winter of Code</h1>
  //   </div>
  // );
}

export default App;
