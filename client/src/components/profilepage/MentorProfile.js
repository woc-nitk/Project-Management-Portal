import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery } from "@apollo/react-hooks";
import { getMentorQuery } from "../../queries";
import UserDetails from "./UserDetails";
import AdminProjects from "./views/Projects";

export default function MentorProfile() {
  const user = useContext(UserContext);
  const { loading, data, error } = useQuery(getMentorQuery, {
    variables: { id: user.id },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    console.log(error);
    return <h1>Some error has occured</h1>;
  }

  return (
    <>
      <UserDetails
        name={data.mentor.name}
        type={user.type}
        org={data.mentor.organization.name}
        email={data.mentor.email}
      />

      <AdminProjects projects={data.mentor.projects} />
    </>
  );
}
