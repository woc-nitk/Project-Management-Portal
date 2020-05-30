import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { ThemeContext } from "../../store/ThemeContext";

export default function Nav() {
  const [theme, setTheme] = useContext(ThemeContext);

  return (
    <>
      <nav>
        <NavLink to="/" exact activeStyle={{ display: "none" }}>
          Home
        </NavLink>

        <NavLink to="/about/" exact activeStyle={{ display: "none" }}>
          About
        </NavLink>

        <NavLink to="/login/" exact activeStyle={{ display: "none" }}>
          Login
        </NavLink>

        <NavLink to="/project/" exact activeStyle={{ display: "none" }}>
          Projects
        </NavLink>
      </nav>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "Dark theme" : "Light theme"}
      </button>
    </>
  );
}
