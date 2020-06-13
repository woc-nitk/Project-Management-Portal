import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const ApplicationForm = ({ pId, aId, mutation }) => {
  return (
    <div className="app">
      <Formik
        initialValues={{
          link: "",
        }}
        onSubmit={async (values) => {
          mutation({
            variables: {
              project_id: pId,
              applicant_id: aId,
              proposal: values.link,
            },
          });
        }}
        validationSchema={Yup.object().shape({
          link: Yup.string().url("enter a valid url").required("Required"),
        })}
      >
        {({ dirty, handleReset, isSubmitting }) => (
          <Form>
            <h1 style={{ marginTop: "60px", marginBottom: "10px" }}>Apply</h1>
            <label htmlFor="link" style={{ display: "block" }}>
              Link To Proposal
            </label>
            <Field type="text" name="link" placeholder="Proposal URL" />
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
