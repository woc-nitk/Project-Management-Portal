import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getOrgAdminQuery, addMentorMutation } from "../../queries";
import UserDetails from "./UserDetails";
import AdminProjects from "./views/Projects";
import Modal from "react-modal";
import MentorForm from "../forms/Mentor_nd_orgAdmin";
import { Link } from "react-router-dom";
import ProjectForm from "../forms/project";

Modal.setAppElement("#root");

export default function OrgAdminProfile() {
  const user = useContext(UserContext);
  const { loading, data, error } = useQuery(getOrgAdminQuery, {
    variables: { id: user.id },
  });

  const [addMentor] = useMutation(addMentorMutation, {
    onError(err) {
      console.log(err);
    },
  });
  const [mentorModal, setMentorModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);

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

  return (
    <>
      <UserDetails
        name={data.orgAdmin.name}
        type={user.type}
        org={data.orgAdmin.organization.name}
        email={data.orgAdmin.email}
      />
      <button
        onClick={() => {
          setMentorModal(true);
        }}
      >
        Add Mentor
      </button>
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

      <Link to="#">All mentors</Link>
      <hr />

      <button
        onClick={() => {
          setProjectModal(true);
        }}
      >
        Add Project
      </button>
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
            mutation={addMentor}
            orgId={data.orgAdmin.organization.id}
            setState={setProjectModal}
          />
        </div>
      </Modal>

      <AdminProjects projects={data.orgAdmin.organization.projects} />
    </>
  );
}
