import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import { getMentorQuery, logoutMutation } from "../../queries";
import UserDetails from "./UserDetails";
import { useCookies } from "react-cookie";
import AdminProjects from "./views/Projects";

export default function MentorProfile({user, setUser}) {
  const [redirectURL, setURL] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(["refresh", "access"]);
  const [logOut] = useMutation(logoutMutation, {
    variables: {
      refresh: cookie.refresh
    },
    onCompleted() {
      setUser({});      
      // Set the refresh cookie for 7 hours from current time
      removeCookie("refresh", {
        path: "/",
      });

      // Set the access cookie for 1 hour from current time
      removeCookie("access", {
        path: "/",
      });

      // Set the redirect url to the one passed or default value
      setURL("/");
    },
    onError(error) {
      console.log("Error occured - " + error);
    }
  });
  const { loading, data, error } = useQuery(getMentorQuery, {
    variables: { id: user.id },
  });

  if (redirectURL) {
    return <Redirect to="/" />;
  }

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

      <button onClick={() => logOut()}>
      Logout
      </button>

      <AdminProjects projects={data.mentor.projects} />
    </>
  );
}
