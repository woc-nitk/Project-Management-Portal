import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getSuperAdminQuery, addOrgMutation } from "../../queries";
import UserDetails from "./UserDetails";
import Modal from "react-modal";
import OrganizationForm from "../forms/Organisation";
import AdminOrganizations from "./views/Organizations";

Modal.setAppElement("#root");

export default function SuperAdminProfile() {
  const [user] = useContext(UserContext);
  const { loading, data, error } = useQuery(getSuperAdminQuery, {
    variables: { id: user.id },
  });

  const [addOrg] = useMutation(addOrgMutation, {
    onError(err) {
      console.log(err);
    },
  });
  const [orgModal, setOrgModal] = useState(false);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    console.log(error);
    return <h1>Some error has occured</h1>;
  }

  function closeModal() {
    setOrgModal(false);
  }

  return (
    <>
      <UserDetails
        name={data.superAdmin.name}
        type={user.type}
        email={data.superAdmin.email}
      />
      <button
        onClick={() => {
          setOrgModal(true);
        }}
      >
        Add Organization
      </button>
      <Modal
        isOpen={orgModal}
        onRequestClose={closeModal}
        contentLabel="OrgModal"
      >
        <div className="modalContent">
          <button
            className="closeModal"
            onClick={closeModal}
            style={{
              background: "none",
              border: "none",
              fontSize: "36px",
            }}
          >
            x
          </button>
          <OrganizationForm mutation={addOrg} setState={setOrgModal} />
        </div>
      </Modal>
      <AdminOrganizations />
    </>
  );
}
