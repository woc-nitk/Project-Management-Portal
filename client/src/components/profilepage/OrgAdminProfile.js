import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getOrgAdminQuery, addMentorMutation, logoutMutation, addProjectMutation } from "../../queries";
import UserDetails from "./UserDetails";
import AdminProjects from "./views/Projects";
import Modal from "react-modal";
import { useCookies } from "react-cookie";
import MentorForm from "../forms/Mentor_nd_orgAdmin";
import { Link, Redirect } from "react-router-dom";
import ProjectForm from "../forms/project";

Modal.setAppElement("#root");

export default function OrgAdminProfile({user, setUser}) {

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

  const { loading, data, error } = useQuery(getOrgAdminQuery, {
    variables: { id: user.id },
  });

  const [addMentor] = useMutation(addMentorMutation, {
    onError(err) {
      console.log(err);
    },
  });

  const [addProject] = useMutation(addProjectMutation, {
    onError(error) {
      console.log(error);
    },
  });

  const [mentorModal, setMentorModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);


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

  function closeMentorModal() {
    setMentorModal(false);
  }
  console.log(data);
  return (
    <>
      <h1>{data.orgAdmin.name}</h1>
      <h2 style={{textTransform:"capitalize"}}>{user.type}</h2>
      <h2>Organization: {data.orgAdmin.organization.name}</h2>
      <i><h3>Email: {data.orgAdmin.email}</h3></i>
      <button onClick={() => logOut()}>
      Logout
      </button>

      <button
        onClick={() => {
          setMentorModal(true);
        }}
      >
        Add Mentor
      </button>
      <br></br>
      <Modal
        isOpen={mentorModal}
        onRequestClose={closeMentorModal}
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
            onClick={closeMentorModal}
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
          <MentorForm
            mutation={addMentor}
            orgId={[data.orgAdmin.organization.id]}
            setState={setMentorModal}
          />
        </div>
      </Modal>
      <hr />

      <button
        onClick={() => {
          setProjectModal(true);
        }}
      >
        Add Project
      </button>
      <br></br>
      <Modal
        isOpen={projectModal}
        onRequestClose={() => {
          setProjectModal(false);
        }}
        contentLabel="ProjectModal"
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
            onClick={() => {
              setProjectModal(false);
            }}
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
          <ProjectForm
            mutation={addProject}
            org_id={data.orgAdmin.organization.id}
            setState={setProjectModal}
          />
        </div>
      </Modal>

      <AdminProjects projects={data.orgAdmin.organization.projects} />
    </>
  );
}
