import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getOrganizationQuery } from "../../queries";

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
    <div>
      <h1>{data.organization.name}</h1>
      <h5>Organization ID:{data.organization.id}</h5>
      <h2>Projects under {data.organization.name}</h2>
      <ul>
        {data.organization.projects.map((proj) => {
          return <li key={proj.id}>{proj.name}</li>;
        })}
      </ul>
    </div>
  );
}
