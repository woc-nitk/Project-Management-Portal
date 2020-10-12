import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

export default function ProjectCard(props) {
  return (
    <Card>
      <Org>{props.org}</Org>
      <Link
        to={props.url}
        style={{
          fontWeight: "600",
          marginTop: "3px",
          textDecoration: "none",
          fontSize: "22px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "2",
          lineHeight: "1.5em",
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
  width: 305px;
  height: 180px;
  border-radius: 20px;
  box-shadow: 0px 3px 10px #888888;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  background: white;

  & a{
    color: #4c566a;
  }

  & a:hover{
    color: black;
  }
`;

const Org = styled.h4`
  font-weight: 300;
  font-size: 16px;
  margin-right: 0;
  margin-left: auto;
`;

const Desc = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-height: 1.5em;
  max-height: 3em;
  font-size:14px;
`;
