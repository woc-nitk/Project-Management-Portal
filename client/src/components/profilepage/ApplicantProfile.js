import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery } from "@apollo/react-hooks";
import { getApplicantQuery } from "../../queries";
import UserDetails from "./UserDetails";
import { Link } from "react-router-dom";

export default function ApplicantProfile() {
  const [user] = useContext(UserContext);
  const { loading, data, error } = useQuery(getApplicantQuery, {
    variables: { id: user.id },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    console.log(error);
    return <h1>Some error has occured</h1>;
  }

  const name = `${data.applicant.first_name} ${data.applicant.middle_name} ${data.applicant.last_name}`;
  const year = data.applicant.allpicant_year;

  return (
    <>
      <UserDetails
        name={name}
        type={user.type}
        year={year}
        email={data.applicant.email}
      />

      {data.applicant.applications.map((application, idx) => {
        return (
          <div key={idx}>
            <Link to={`/project/${application.project.id}`}>
              <p>{application.project.name}</p>
            </Link>
            <a href={application.proposal}>Proposal</a>
            <p>Status: Show status here!!</p>
          </div>
        );
      })}
    </>
  );
}
