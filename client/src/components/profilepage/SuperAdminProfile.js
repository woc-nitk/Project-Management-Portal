import React, { useContext, useState } from "react";
import { UserContext } from "../../store/UserContext";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getSuperAdminQuery, addOrgMutation, logoutMutation, changePasswordMutation } from "../../queries";
import UserDetails from "./UserDetails";
import Modal from "react-modal";
import OrganizationForm from "../forms/Organisation";
import { Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import AdminOrganizations from "./views/Organizations";
import { ChangePasswordForm } from "../forms/Organisation";

Modal.setAppElement("#root");

export default function SuperAdminProfile({user, setUser}) {

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


  const [changePasswordModal, setPasswordModal] = useState(false);

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
      {
        errorMessage && <div className="input-feedback">{errorMessage}</div>
      }

      <button onClick={() => logOut()}
      style={{background: "var(--red)"}}>
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
