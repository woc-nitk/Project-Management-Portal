import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function OrganizationCard(props) {
  return (
    <Card>
      <Link
        to={props.url}
        style={{
          fontWeight: "600",
          marginTop: "5px",
          textDecoration: "none",
          fontSize: "23px"
        }}
      >
        {props.title}
      </Link>

      <Desc>{props.desc}</Desc>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  font-family: "Montserrat", sans-serif;
  width: 310px;
  height: 150px;
  border-radius: 20px;
  box-shadow: 0px 3px 10px #888888;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: white;
  margin-bottom: 50px;

  & a{
    color: #4c566a;
  }

  & a:hover{
    color: black;
  }
`;

const Desc = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5em;
  max-height: 3em;
  position: absolute;
  font-size: 16px;
  top: 5em;
`;
