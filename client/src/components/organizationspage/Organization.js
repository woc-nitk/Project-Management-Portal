import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getOrganizationQuery } from "../../queries";
import ProjectCard from "../cards/ProjectCard";

export default function Organization({ match }) {
  const {
    params: { orgId },
  } = match;
  const { loading, data, error } = useQuery(getOrganizationQuery, {
    variables: { org_id: orgId },
  });
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <h1>Error fetching organization details</h1>;
  }

  return (
    <div className="container" style={{ fontSize: "16px" }}>
      <h1 style={{ marginTop: "60px", marginBottom: "20px" }}>
        {data.organization.name}
      </h1>
      <p>{data.organization.description}</p>
      <h2 style={{ marginTop: "40px", marginTop: "5px" }}>
        Projects under {data.organization.name}
      </h2>
      <hr></hr>
      <div className="grid">
        {data.organization.projects.map((proj) => {
          return (
            <ProjectCard
              title={proj.name}
              url={`/project/${proj.id}`}
              desc={proj.work}
            />
          );
        })}
      </div>
    </div>
  );
}
