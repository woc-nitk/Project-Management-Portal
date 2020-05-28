import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getProjectsQuery } from "../../queries";

export default function Projects() {
  const { loading, data, error } = useQuery(getProjectsQuery);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <h1>Error fetching projects</h1>;
  }

  return (
    <div>
      {data.projects.map((project) => {
        <div key={project.id}>
          <h1>{project.name}</h1>
          <p>{project.work}</p>
        </div>;
      })}
    </div>
  );
}
