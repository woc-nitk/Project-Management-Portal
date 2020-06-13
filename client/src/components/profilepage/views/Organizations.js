import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { getOrganizationsQuery } from "../../../queries";
import {Link} from "react-router-dom";

export default function Organizations() {
  const { loading, data, error } = useQuery(getOrganizationsQuery);

  if (loading) return <h3>Loading ...</h3>;
  if (error) {
    console.log(error);
    return <h3>Error fetching organizations</h3>;
  }

  return (
    <div style={{fontSize:"24px"}}>
      <ul>
        {data.organizations.map((org, idx) => {
          return <li key={idx} style={{margin: "20px 0"}}>
            <Link to={`admin/organization/${org.id}`}>
              <p>{org.name}</p>
            </Link>
          </li>;
        })}
      </ul>
    </div>
  );
}
