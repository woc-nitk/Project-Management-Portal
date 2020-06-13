import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getProjectsQuery } from "../../queries";
import ProjectCard from "../cards/ProjectCard";

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
    <div className="container">
      <h1
        style={{
          fontSize: "36px",
          marginTop: "60px",
          marginBottom: "5px",
        }}
      >
        Projects
      </h1>
      <hr
        style={{
          flex: "0 0 100%",
          marginBottom: "50px",
        }}
      />

      <div className="grid">
        {data.projects.map((project) => {
          return (
            <ProjectCard
              key={project.id}
              org={project.organization.name}
              url={`/project/${project.id}`}
              title={project.name}
              desc={project.work}
            />
          );
        })}
      </div>
    </div>
  );
}
