import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeContext } from "../store/ThemeContext";
import { UserContext } from "../store/UserContext";
4;
import Home from "./homepage/Home";
import About from "./aboutpage/About";
import Nav from "./navigation/Nav";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { getCookie } from "../cookieFunctions";

const REFRESH_QUERY = gql`
  {
    renewAuth(refresh: ${getCookie("refresh")}) {
      id,
      role,
      auth,
      refresh
    }
  }
`;

function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({});
  const { loading, error, data } = useQuery(REFRESH_QUERY);
  if (data) {
    setUser(data);
  }
  return (
    <div className={`App ${theme}`} style={{ minHeight: "100vh" }}>
      <Router>
        <UserContext.Provider value={[user, setUser]}></UserContext.Provider>
        <ThemeContext.Provider value={[theme, setTheme]}>
          <Nav />

          <Route path="/" exact component={Home} />
          <Route path="/profile/" exact component={Profile} />
          {/* <Route path="/projects/" exact component={Projects}/> 
          <Route path="/projects/:id" exact component={Project}/> 
              <Route path="/organizations/" exact component={Organizations}
              <Route path="/organizations/:id" exact component={Organization}
          */}
          <Route path="/about/" exact component={About} />
        </ThemeContext.Provider>
      </Router>
    </div>
  );
}

export default App;
