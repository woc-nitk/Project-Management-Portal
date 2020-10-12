import React, { useState, useEffect } from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import { ThemeContext } from "../store/ThemeContext";
import { UserContext } from "../store/UserContext";
import Home from "./homepage/Home";
import About from "./aboutpage/About";
import Projects from "./projectspage/Projects";
import Project from "./projectspage/Project";
import Organizations from "./organizationspage/Organizations";
import Organization from "./organizationspage/Organization";
import Nav from "./navbar/Navbar";
import { useCookies } from "react-cookie";
import { useMutation } from "@apollo/react-hooks";
import { refreshMutation } from "../queries";
import Login, { Logout } from "./login/Login";
import ProjectApplications from "./profilepage/views/ProjectApplications";
import OrganizationProjects from "./profilepage/views/OrganizationProjects";
import SignUp from "./signup/applicant";
import Profile from "./profilepage/Profile";
import Footer from "./footer/footer";

function App() {
  const [theme, setTheme] = useState("light");
  const [user, setUser] = useState({
    id: "",
    type: "",
    auth: "",
    refresh: "",
  });
  const [cookies, setCookie] = useCookies(["refresh", "access"]);
  const [navbarOpen, setNav] = useState(false);
  const handleNavbar = () => {
    setNav(!navbarOpen);
  };

  // The mutation to be called every hour to keep the user logged in
  const [refresh] = useMutation(refreshMutation, {
    onCompleted({ renewAuth }) {
      const now = new Date().getTime();

      // Update the global user on data return
      setUser(renewAuth);

      // Set the refresh cookie for 7 hours from current time
      setCookie("refresh", renewAuth.refresh, {
        path: "/",
        expires: new Date(now + 7 * 3600 * 1000),
      });

      // Set the access cookie for 1 hour from current time
      setCookie("access", renewAuth.auth, {
        path: "/",
        expires: new Date(now + 1 * 3600 * 1000),
      });
    },
    onError(err) {
      console.log(err);
    },
  });

  useEffect(() => {

    // First time when thge page loads, call the mutation
    refresh({ variables: { refresh: cookies.refresh || "asd" } });

    // Call the mutation every 1 hour because every one hour, the access token becomes invalid
    const interval = setInterval(() => {
      refresh({ variables: { refresh: cookies.refresh } });
    }, 3600000);
    return () => clearInterval(interval);
  }, []);


  return (
    <div className={`App ${theme}`} style={{ minHeight: "100vh" }}>
      <Router>
        <UserContext.Provider value={[user, setUser]}>
          <ThemeContext.Provider value={[theme, setTheme]}>
            <div>
              <Nav navbarState={navbarOpen} handleNavbar={handleNavbar} user={user} />
              <div className="page">
                <Route path="/" exact component={Home} />
                <Route path="/about/" exact component={About} />
                <Route path="/login/" exact component={Login} />
                <Route path="/logout/" exact component={Logout} />
                <Route path="/signup/" exact component={SignUp} />
                <Route path="/projects/" exact component={Projects} />
                <Route path="/organizations/" exact component={Organizations} />
                <Route
                  exact
                  path="/profile"
                  render={() => <Profile user={user} setUser={setUser} />}
                />
                <Route
                  exact
                  path="/project/:projectId"
                  render={(props) => <Project {...props} user={user} />}
                />
                <Route path="/organization/:orgId" exact component={Organization} />

                <Route
                  path="/admin/project/:projectId"
                  exact
                  component={ProjectApplications}
                />
                <Route
                  path="/admin/organization/:orgId"
                  exact
                  component={OrganizationProjects}
                />
              </div>
            </div>
            <Footer />
          </ThemeContext.Provider>
        </UserContext.Provider>
      </Router>
    </div>
  );
}

export default App;
