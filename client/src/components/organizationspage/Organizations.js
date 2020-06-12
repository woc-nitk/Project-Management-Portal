import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getOrganizationsQuery } from "../../queries";
import OrganizationCard from "../cards/OrganizationCard";

export default function Organizations() {
  const { loading, data, error } = useQuery(getOrganizationsQuery);
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <h1>Error fetching organizations</h1>;
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
        Organizations
      </h1>
      <hr
        style={{
          flex: "0 0 100%",
          marginBottom: "50px",
        }}
      />

      <div className="grid">
        {data.organizations.map((organization) => {
          return (
            <OrganizationCard
              key={organization.id}
              title={organization.name}
              url={`/organization/${organization.id}`}
              desc={organization.description}
            />
          );
        })}
      </div>
    </div>
  );
}
