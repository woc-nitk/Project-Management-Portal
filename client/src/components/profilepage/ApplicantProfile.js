import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
import { getApplicantQuery, updateApplcation, logoutMutation, changePasswordMutation } from "../../queries";
import UserDetails from "./UserDetails";
import styled from "styled-components";
import ApplicationCard from "../cards/ApplicationCard";
import Modal from "react-modal";
import { useCookies } from "react-cookie";
import { UpdateProposal } from "../forms/Organisation";
import { ChangePasswordForm } from "../forms/Organisation";

export default function ApplicantProfile({user, setUser}) {
  const [redirectURL, setURL] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["refresh", "access"]);
  const [updateApp] = useMutation(updateApplcation, {
    onError: (error) => console.log(error)
  });
  const [applicant_id, set_applicant_id] = useState("");
  const [project_id, set_project_id] = useState("");
  const [openModal, set_open_modal] = useState(false);
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

  const { loading, data, error } = useQuery(getApplicantQuery, {
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

  const name = `${data.applicant.first_name} ${data.applicant.middle_name} ${data.applicant.last_name}`;
  const year = data.applicant.allpicant_year;
  return (
    <div className="container">
      <br></br>
      <UserDetails
        name={name}
        type={user.type}
        year={year}
        email={data.applicant.email}
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
              org={application.project.organization.name}
              title={application.project.name}
              url={application.proposal}
              accepted={accepted}
              rejected={rejected}
              pending={pending}
              update={update}
              handleClick={() => {set_applicant_id(user.id); set_project_id(application.project.id); set_open_modal(true);}}
            />
          );
        })}
      </Grid>
      <Modal
        isOpen={openModal}
        onRequestClose={() => set_open_modal(false)}
        contentLabel="MentorModal"
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
            onClick={() => set_open_modal(false)}
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
          <UpdateProposal mutation={updateApp} setState={set_open_modal} project_id={project_id} applicant_id={applicant_id}/>
        </div>
        
      </Modal>

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
