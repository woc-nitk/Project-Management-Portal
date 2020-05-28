import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import "./forms.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loginMutation } from "../../queries";
import { useCookies } from "react-cookie";
import { UserContext } from "../../store/UserContext";

const Login = ({ redirect = "/" }) => {
  const [logInUser, { loading, error, data }] = useMutation(loginMutation);
  const [cookies, setCookie, removeCookie] = useCookies(["refresh", "access"]);
  const [redirectURL, setURL] = useState(null);
  const [user, setUser] = useContext(UserContext);

  useEffect(() => {
    if (data) {
      console.log(data);
      setUser(data.login);
      setCookie("refresh", user.refresh, { path: "/" });
      setCookie("access", user.auth, { path: "/" });
      setURL(redirect);
    }
  }, [data]);

  if (redirectURL) {
    return <Redirect to={redirectURL} />;
  }

  return (
    <div className="app">
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        // onSubmit={async (values) => {
        //   await new Promise((resolve) => setTimeout(resolve, 500));
        //   alert(`The entered email is :${values.email}`);
        // }}
        onSubmit={(values, { setSubmitting }) =>
          logInUser({ variables: values })
        }
        validationSchema={Yup.object().shape({
          email: Yup.string().email().required("This field is required"),
          password: Yup.string().required("This field is required"),
        })}
      >
        {({ dirty, handleReset, isSubmitting }) => (
          <Form>
            {error && (
              <div className="input-feedback">Incorrect email or password</div>
            )}
            <label htmlFor="email" style={{ display: "block" }}>
              Email
            </label>
            <Field type="email" name="email" placeholder="Enter your email" />
            <ErrorMessage
              className="input-feedback"
              name="email"
              component="div"
            />
            <label htmlFor="password" style={{ display: "block" }}>
              Password
            </label>
            <Field
              type="password"
              name="password"
              placeholder="Enter your password"
            />
            <ErrorMessage
              className="input-feedback"
              name="password"
              component="div"
            />
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>

      {/* <MoreResources /> */}
    </div>
  );
};

export default Login;
