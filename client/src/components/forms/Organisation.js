import React from "react";
import "./forms.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const OrganisationForm = ({ mutation, setState }) => {
  return (
    <div className="app">
      <Formik
        initialValues={{
          orgName: "",
          desc: "",
        }}
        onSubmit={async (values) => {
          mutation({ variables: values });
          setState(false);
        }}
        validationSchema={Yup.object().shape({
          orgName: Yup.string().required("This field is required"),
          desc: Yup.string().required("This field is required"),
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1>Add Organisation</h1>
            <label htmlFor="orgName" style={{ display: "block" }}>
              Organisation Name
            </label>
            <Field
              type="text"
              name="orgName"
              placeholder="Enter the org name"
            />
            <ErrorMessage
              className="input-feedback"
              name="orgName"
              component="div"
            />

            <label htmlFor="orgName" style={{ display: "block" }}>
              Description
            </label>
            <Field
              as="textarea"
              name="desc"
              placeholder="Description of the organization"
            />
            <ErrorMessage
              className="input-feedback"
              name="desc"
              component="div"
            />

            <button type="submit" disabled={isSubmitting}>
              Submit
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default OrganisationForm;
