import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { ThemeContext } from "../store/ThemeContext";
import { UserContext } from "../store/UserContext";
import Home from "./homepage/Home";
import About from "./aboutpage/About";
import Projects from "./projectspage/Projects"
import Nav from "./navigation/Nav";
import { useCookies } from "react-cookie";
import { useQuery } from "@apollo/react-hooks";
import { refreshMutation } from "../queries";
import Login from "./login/Login";

function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({
    id: "",
    role: "",
    auth: "",
    refresh: "",
  });
  const [cookies, setCookie, removeCookie] = useCookies(["refresh", "access"]);

  // if(error){
  //   console.log(error);
  // }

  // if(data) {
  //   curUser=data.renewAuth;
  // }
  React.useEffect(function effectFunction() {
    const { data } = useQuery(refreshMutation, {
      variables: { refresh: cookies.refersh },
    });
    if (data) {
      setUser(data.renewAuth);
      setCookie("refresh", user.refresh, { path: "/" });
      setCookie("access", user.auth, { path: "/" });
    }
  }, []);

  // setUser(curUser);

  return (
    <div className={`App ${theme}`} style={{ minHeight: "100vh" }}>
      <Router>
        <UserContext.Provider value={[user, setUser]}>
          <ThemeContext.Provider value={[theme, setTheme]}>
            <Nav />

            <Route path="/" exact component={Home} />
            <Route path="/about/" exact component={About} />
            <Route path="/login/" exact component={Login} />
            <Route path="/projects/" exact component={Projects} />
            {/* <Route path="/profile/" exact component={Profile} />
            <Route path="/projects/:id" exact component={Project} />
            <Route path="/organizations/" exact component={Organizations} />
            <Route path="/organizations/:id" exact component={Organization} /> */}
          </ThemeContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
