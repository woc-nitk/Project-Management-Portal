import React, { useState } from "react";
import Modal from "react-modal";
import { getOrganizationQuery, addOrgAdminMutation } from "../../../queries";
import OrgAdminForm from "../../forms/Mentor_nd_orgAdmin";
import { useQuery, useMutation } from "@apollo/react-hooks";
import AdminProjects from "./Projects";

export default function OrganizationProjects({ match }) {
  const {
    params: { orgId },
  } = match;

  const { loading, data, error } = useQuery(getOrganizationQuery, {
    variables: { org_id: orgId },
  });
  const [orgAdminModal, setOrgAdminModal] = useState(false);

  const [addOrgAdmin] = useMutation(addOrgAdminMutation, {
    onError(err) {
      console.log(err);
    },
  });
  if (loading) return <h1>Loading...</h1>;

  if (error) {
    console.log(error);
    return <h1>Error occurred!</h1>;
  }



  return (
    <div className="container" style={{fontSize:"20px"}}>
      {/* 
      X-Get the org id from params,
      X-Show org name
      X-Give add org admin button
      X-Display the admin project component
      */}
      <h1 style={{fontSize:"48px", marginTop:"50px", marginBottom:"20px"}}>{data.organization.name}</h1>
      <button onClick={() => setOrgAdminModal(true)}>
        Add Organization Admin
      </button>
      <hr></hr>
      <Modal
        isOpen={orgAdminModal}
        onRequestClose={() => {
          setOrgAdminModal(false);
        }}
        contentLabel="OrgAdminModal"
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
              setOrgAdminModal(false);
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
          <OrgAdminForm
            mutation={addOrgAdmin}
            orgId={orgId}
            setState={setOrgAdminModal}
          />
        </div>
      </Modal>
      <h1 style={{fontSize:"36px", marginTop:"50px", marginBottom:"20px"}}>Projects maintained by {data.organization.name}</h1>
      <AdminProjects projects={data.organization.projects} />
    </div>
  );
}
