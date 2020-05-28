import React from "react";
import "./forms.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const ApplicationForm = () => {
  return (
    <div className="app">
      <Formik
        initialValues={{
          orgName: "",
        }}
        onSubmit={async (values) => {
          await new Promise((resolve) => setTimeout(resolve, 500));
          alert(`The entereed link is :${values.link}`);
        }}
        validationSchema={Yup.object().shape({
          link: Yup.string().url("enter a valid url").required("Required"),
        })}
      >
        {({ dirty, handleReset, isSubmitting }) => (
          <Form>
            <h1>Proposal</h1>
            <label htmlFor="proposal" style={{ display: "block" }}>
              Link To Proposal
            </label>
            <Field type="text" name="link" placeholder="link" />
            <ErrorMessage
              className="input-feedback"
              name="link"
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

export default ApplicationForm;
