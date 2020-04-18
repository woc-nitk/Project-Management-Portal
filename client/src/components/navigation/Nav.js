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
      </nav>
      <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        {theme === "light" ? "Dark theme" : "Light theme"}
      </button>
    </>
  );
}
