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
    <div className="container org">
      <h1>
        {data.organization.name}
      </h1>
      <p>{data.organization.description}</p>
      <h2 style={{ marginTop: "40px", marginBottom: "5px" }}>
        Projects under {data.organization.name}
      </h2>
      <hr
        style={{
          flex: "0 0 100%",
          marginBottom: "50px",
        }}
      />
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
