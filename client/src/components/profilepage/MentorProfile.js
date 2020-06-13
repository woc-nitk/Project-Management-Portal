import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import { getMentorQuery, logoutMutation, changePasswordMutation } from "../../queries";
import UserDetails from "./UserDetails";
import { useCookies } from "react-cookie";
import AdminProjects from "./views/Projects";
import { ChangePasswordForm } from "../forms/Organisation";
import Modal from "react-modal";

export default function MentorProfile({user, setUser}) {
  const [redirectURL, setURL] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["refresh", "access"]);
  const [logOut] = useMutation(logoutMutation, {
    variables: {
      refresh: cookies.refresh
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
  const [errorMessage, setErrormessage] = useState(false);
  const [changePassword] = useMutation(changePasswordMutation, {
    onCompleted(data) {
      setUser({});      
      // Set the refresh cookie for 7 hours from current time
      removeCookie("refresh", {
        path: "/",
      });

      // Set the access cookie for 1 hour from current time
      removeCookie("access", {
        path: "/",
      });
    },
    onError(error) {
      console.log(error);
      setErrormessage("Incorrect password");
    }
  });


  const { loading, data, error } = useQuery(getMentorQuery, {
    variables: { id: user.id },
  });

  const [changePasswordModal, setPasswordModal] = useState(false);

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
      {
        errorMessage && <div className="input-feedback">{errorMessage}</div>
      }
      <button onClick={() => logOut()} style={{background: "var(--red)"}}>
      Logout
      </button>

      <button
      onClick={() => {
        setPasswordModal(true);
      }}
      style={{background: "var(--red)"}}
    >
      Change Password
    </button>
    <br></br>
    <Modal
      isOpen={changePasswordModal}
      onRequestClose={() => setPasswordModal(false)}
      contentLabel="ChangePasswordModal"
      style={{
        content: {
          minWidth: "300px",
          // height:"50rem"
          top: "50%",
          left: "50%",
          right: "auto",
          bottom: "auto",
          marginRight: "-50%",
          transform: "translate(-50%,-50%",
          padding: "3rem",
          paddingTop: "1rem",
        },
      }}
    >
      <div className="modalContent">
        <button
          className="closeModal"
          onClick={() => setPasswordModal(false)}
          style={{
            background: "none",
            color: "#000000",
            border: "none",
            margin: "0",
            padding: "0",
            boxShadow: "none",
          }}
        >
          x
        </button>

        <ChangePasswordForm
          mutation={changePassword}
          refresh={cookies.refresh}
          setState={setPasswordModal}
        />
      </div>
    </Modal>

      <AdminProjects projects={data.mentor.projects} />
    </>
  );
}
