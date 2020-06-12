import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery } from "@apollo/react-hooks";
import { getApplicantQuery } from "../../queries";
import UserDetails from "./UserDetails";
import styled from "styled-components";
import { Link } from "react-router-dom";
import ApplicationCard from "../cards/ApplicationCard";

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
    <div className="container">
      <h1
        style={{
          fontWeight: "400",
          fontSize: "48px",
        }}
      >
        Dashboard
      </h1>
      <br></br>
      <UserDetails
        name={name}
        type={user.type}
        year={year}
        email={data.applicant.email}
      />

      <h2
        style={{
          fontWeight: "400",
          fontSize: "36px",
        }}
      >
        Applications
      </h2>

      <hr
        style={{
          flex: "0 0 100%",
          marginBottom: "50px",
        }}
      ></hr>

      <Grid>
        {data.applicant.applications.map((application, idx) => {
          let accepted;
          let rejected;
          let pending;
          let update = false;
          if (application.accepted === true) {
            accepted = true;
            rejected = false;
            pending = false;
          } else if (application.accepted === false) {
            accepted = false;
            rejected = true;
            pending = false;
          } else {
            pending = true;
            update = true;
            accepted = false;
            rejected = false;
          }
          return (
            <ApplicationCard
              org={application.organization.name}
              title={application.project.name}
              url={application.proposal}
              accepted={accepted}
              rejected={rejected}
              pending={pending}
              update={update}
              handleClick={() => {}}
            />
          );
        })}
      </Grid>
    </div>
  );
}

const Grid = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  @media (max-width: 960px) {
    justify-content: space-evenly;
  }
`;
