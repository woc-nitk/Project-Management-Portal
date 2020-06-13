import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const MentorForm = ({ orgId, mutation, setState }) => {
  return (
    <div className="app">
      <Formik
        initialValues={{
          regNum: "",
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        }}
        onSubmit={(values, { setSubmitting }) => {
          mutation({ variables: { ...values, orgId, absolute_year: new Date().getFullYear() } });
          setState(false);
        }}
        validationSchema={Yup.object().shape({
          regNum: Yup.string().required("Required").matches(/^[0-9]{6,6}$/, "Registration number should be 6 digits"),
          name: Yup.string().required("Required"),
          email: Yup.string().email().required("Required"),
          password: Yup.string()
            .min(8, "Password must be at least 8 characters long")
            .matches(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
              "Password must contain one uppercase character, one lowercase character and one number"
            )
            .required("This field is required"),

          confirmPassword: Yup.string().when("password", {
            is: (val) => val && val.length > 0,
            then: Yup.string()
              .oneOf(
                [Yup.ref("password")],
                "Both passwords need to be the same"
              )
              .required(),
          }),
        })}
      >
        {({ dirty, handleReset, isSubmitting }) => (
          <Form>
          <label htmlFor="regNum" style={{ display: "block" }}>
              Registration number
            </label>
            <Field type="text" name="regNum" placeholder="xxxxxx" />
            <ErrorMessage
              className="input-feedback"
              name="regNum"
              component="div"
            />
            <label htmlFor="name" style={{ display: "block" }}>
              Name
            </label>
            <Field type="text" name="name" placeholder="First Name" />
            <ErrorMessage
              className="input-feedback"
              name="name"
              component="div"
            />
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
              placeholder="Enter password"
            />
            <ErrorMessage
              className="input-feedback"
              name="password"
              component="div"
            />
            <label htmlFor="confirmPassword" style={{ display: "block" }}>
              Confirm password
            </label>
            <Field
              type="password"
              name="confirmPassword"
              placeholder="Enter password"
            />
            <ErrorMessage
              className="input-feedback"
              name="confirmPassword"
              component="div"
            />
            <button
              type="button"
              className="outline"
              onClick={handleReset}
              disabled={!dirty || isSubmitting}
            >
              Reset
            </button>
            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MentorForm;
