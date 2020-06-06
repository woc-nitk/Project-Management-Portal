import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  getOrgAdminQuery,
  getOrgMentorsQuery,
  addMentorMutation,
} from "../../queries";
import UserDetails from "./UserDetails";
import AdminProjects from "./views/Projects";
import Modal from "react-modal";
import MentorForm from "../forms/Mentor_nd_orgAdmin";

Modal.setAppElement("#root");

export default function OrgAdminProfile() {
  const user = useContext(UserContext);
  const { loading, data, error } = useQuery(getOrgAdminQuery, {
    variables: { id: user.id },
  });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    console.log(error);
    return <h1>Some error has occured</h1>;
  }
  [addMentor] = useMutation(addMentorMutation, {
    onError(err) {
      console.log(err);
    },
  });
  const [mentorModal, setMentorModal] = useState(false);
  const [projectModal, setProjectModal] = useState(false);

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
      >
        <div className="modalContent">
          <button
            className="closeModal"
            onClick={closeMentorModal}
            style={{
              background: "none",
              border: "none",
              fontSize: "36px",
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
      <Link to="#">
        <button>Add Project</button>
      </Link>
      <AdminProjects projects={data.orgAdmin.organization.projects} />
    </>
  );
}
