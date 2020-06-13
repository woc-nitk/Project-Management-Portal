import React from "react";
import styled from "styled-components";
import { useSpring, animated, config } from "react-spring";
import { NavLink } from "react-router-dom";

import Brand from "./Brand";
import BurgerMenu from "./BurgerMenu";
import CollapseMenu from "./CollapseMenu";

const Navbar = (props) => {
  const barAnimation = useSpring({
    from: { transform: "translate3d(0, -10rem, 0)" },
    transform: "translate3d(0, 0, 0)",
  });

  const linkAnimation = useSpring({
    from: { transform: "translate3d(0, 30px, 0)", opacity: 0 },
    to: { transform: "translate3d(0, 0, 0)", opacity: 1 },
    delay: 800,
    config: config.wobbly,
  });

  return (
    <>
      <NavBar style={barAnimation}>
        <FlexContainer>
          <Brand />
          <NavLinks style={linkAnimation}>
            <NavLink to="/" exact activeStyle={{ display: "none" }}>
              Home
            </NavLink>
            <NavLink to="/about" exact activeStyle={{ display: "none" }}>
              About
            </NavLink>
            <NavLink to="/projects" exact activeStyle={{ display: "none" }}>
              Projects
            </NavLink>
            <NavLink
              to="/organizations"
              exact
              activeStyle={{ display: "none" }}
            >
              Orgs
            </NavLink>
            <NavLink to="/profile" exact activeStyle={{ display: "none" }}>
              Profile
            </NavLink>
            <NavLink to="/login" exact activeStyle={{ display: "none" }}>
            Login
          </NavLink>
          <NavLink to="/signup" exact activeStyle={{ display: "none" }}>
            Signup
          </NavLink>
          </NavLinks>
          <RightSide>
            <BurgerWrapper>
              <BurgerMenu
                navbarState={props.navbarState}
                handleNavbar={props.handleNavbar}
              />
            </BurgerWrapper>
            {/* <Sun style={{ height: "28px", fill: "var(--text-prim)" }} /> */}
          </RightSide>
        </FlexContainer>
      </NavBar>
      <CollapseMenu
        navbarState={props.navbarState}
        handleNavbar={props.handleNavbar}
      />
    </>
  );
};

export default Navbar;

const NavBar = styled(animated.nav)`
  width: 100%;
  top: 0;
  left: 0;
  background: var(--dark-0);
  z-index: 2;
  font-size: 1.4rem;
  top: 0;
  position: sticky;
`;

const FlexContainer = styled.div`
  max-width: 120rem;
  display: flex;
  margin: auto;
  padding: 0 2rem;
  justify-content: space-between;
  height: 5rem;
`;

const NavLinks = styled(animated.ul)`
  justify-self: end;
  list-style-type: none;
  margin: auto 0;

  & a {
    color: var(--silver-0);
    text-transform: uppercase;
    font-weight: 600;
    border-bottom: 1px solid transparent;
    margin: 0 1.5rem;
    transition: all 300ms linear 0s;
    text-decoration: none;
    cursor: pointer;
    font-size: 16px;

    &:hover {
      color: var(--silver-3);
      border-bottom: 1px solid var(--silver-3);
    }

    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const RightSide = styled.div`
  width: 85px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  @media (min-width: 768px) {
    width: 4vw;
  }
`;

const BurgerWrapper = styled.div`
  margin: auto 0;
  /* display: flex; */

  @media (min-width: 769px) {
    display: none;
  }
`;
