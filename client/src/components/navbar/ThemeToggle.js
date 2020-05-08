import React from "react";
import styled from "styled-components";

import { ReactComponent as Sun } from "../../assets/sun.svg";

const Theme = () => {
  return (
    <>
      <Sun />
    </>
  );
};

export default Theme;

const Image = styled.img`
  height: 85%;
  margin: 0 auto;
`;
