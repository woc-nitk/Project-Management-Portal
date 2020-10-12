import ApplicantForm from "../forms/Applicant";
import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signUpMutation } from "../../queries";
import { useCookies } from "react-cookie";
import { UserContext } from "../../store/UserContext";

const SignUp = ({ redirect = "/" }) => {
    const [cookie, setCookie, removeCookie] = useCookies(["refresh", "access"]);
    const [redirectURL, setURL] = useState(null);
    const [user, setUser] = useContext(UserContext);
    const [signUpUser, { error }] = useMutation(signUpMutation, {
        onCompleted({ signUp }) {
            const now = new Date().getTime();

            // Update the global user on data return
            setUser(signUp);

            // Set the refresh cookie for 7 hours from current time
            setCookie("refresh", signUp.refresh, {
                path: "/",
                expires: new Date(now + 7 * 3600 * 1000),
            });

            // Set the access cookie for 1 hour from current time
            setCookie("access", signUp.auth, {
                path: "/",
                expires: new Date(now + 1 * 3600 * 1000),
            });

            // Set the redirect url to the one passed or default value
            setURL(redirect);
        },
        onError(error) {
            console.log("Error occured - " + error);
        }
    });

    if (redirectURL) {
        return <Redirect to={redirectURL} />;
    }

    return (
        <div className="container" style={{ fontSize: "16px" }}>
            <ApplicantForm signUpUser={signUpUser} error={error} />
        </div>
    )
};

export default SignUp;
