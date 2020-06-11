import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getProjectQuery } from "../../queries";

export default function Projects({ match, user }) {
  const {
    params: { projectId },
  } = match;

  const { loading, data, error } = useQuery(getProjectQuery, {
    variables: { id: projectId },
  });
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <h1>Error fetching projects</h1>;
  }

  return (
    <div key={user.id}>
      <h1>{data.project.name}</h1>
      <p>{data.project.work}</p>
      <ul>
        {data.project.prerequisites.map((p, idx) => {
          return <li key={idx}>{p}</li>;
        })}
      </ul>
      <ul>
        {data.project.mentors.map((p, idx) => {
          return <li key={idx}>{p.name}</li>;
        })}
      </ul>
    </div>
  );
}
