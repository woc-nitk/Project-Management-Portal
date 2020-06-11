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
      {data.organizations.map((organization) => {
        return (
          <OrganizationCard
            key={organization.id}
            title={organization.name}
            url={`/organization/${organization.id}`}
            desc={
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            }
          />
        );
      })}
    </div>
  );
}
