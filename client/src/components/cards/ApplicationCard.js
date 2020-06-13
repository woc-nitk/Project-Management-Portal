import React from "react";
import styled from "styled-components";

export default function ApplicationCard(props) {
  return (
    <Card>
      <Org>{props.org}</Org>
      <a
        href={props.url}
        style={{
          fontWeight: "600",
          color: "black",
          marginTop: "5px",
          textDecoration: "none",
          fontSize: "27px",
          color: "#4c566a",
        }}
      >
        {props.title}
      </a>
      <Status>
        {props.accepted && <Accepted>Accepted</Accepted>}
        {props.rejected && <Rejected>Rejected</Rejected>}
        {props.pending && <Pending>Pending</Pending>}
        {props.update && (
          <Update onClick={() => props.handleClick()}>Update</Update>
        )}
      </Status>
    </Card>
  );
}

const Card = styled.div`
  position: relative;
  font-family: "Montserrat", sans-serif;
  width: 300px;
  height: 150px;
  border-radius: 20px;
  box-shadow: 0px 3px 10px #888888;
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-bottom: 50px;
  background: white;
`;

const Org = styled.h4`
  font-weight: 300;
  font-size: 16px;
  margin-right: 0;
  margin-left: auto;
`;

const Status = styled.div`
  font-weight: 600;
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin-bottom: 0;
  margin-top: auto;
`;

const Pending = styled.p`
  color: var(--dark-4);
`;

const Accepted = styled.p`
  color: var(--green);
`;

const Rejected = styled.p`
  color: var(--red);
`;

const Update = styled.p`
  cursor: pointer;
  color: var(--blue-0);
`;
