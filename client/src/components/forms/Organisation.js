import React from "react";
import "./forms.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const OrganisationForm = () => {
  return (
    <div className="app">
      <Formik
        initialValues={{
          orgName: ""
        }}
        onSubmit={async values => {
          await new Promise(resolve => setTimeout(resolve, 500));
          alert(`The entereed name is :${values.orgName}`);
        }}
        validationSchema={Yup.object().shape({
          orgName: Yup.string().required("Required")
        })}
      >
        {({ dirty, handleReset, isSubmitting }) => (
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

export default OrganisationForm;
