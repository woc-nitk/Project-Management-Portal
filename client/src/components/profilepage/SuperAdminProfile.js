import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getSuperAdminQuery, addOrgMutation, logoutMutation } from "../../queries";
import UserDetails from "./UserDetails";
import Modal from "react-modal";
import OrganizationForm from "../forms/Organisation";
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import AdminOrganizations from "./views/Organizations";

Modal.setAppElement("#root");

export default function SuperAdminProfile({user, setUser}) {

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


  const { loading, data, error } = useQuery(getSuperAdminQuery, {
    variables: { id: user.id },
  });

  const [addOrg] = useMutation(addOrgMutation, {
    onError(err) {
      console.log(err);
    },
  });
  const [orgModal, setOrgModal] = useState(false);


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

      <button onClick={() => logOut()}>
      Logout
      </button>

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
      <h1>All Organizations </h1>
      <hr></hr>
      <AdminOrganizations />
    </>
  );
}
