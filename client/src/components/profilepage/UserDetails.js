import React from "react";

export default function UserDetails(props) {
  return (
    <div>
      <h2>{props.name}</h2>
      <p>
        <i>{props.email}</i>
      </p>
      {props.year && <p>Year: {props.email}</p>}
      {props.org && <p>Organization: {props.mentor_org}</p>}
    </div>
  );
}
