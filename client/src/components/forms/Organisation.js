import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
const OrganisationForm = ({ mutation, setState }) => {
  return (
    <div>
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

export const UpdateProposal = ({ mutation, setState, project_id, applicant_id }) => {
  return (
    <div>
      <Formik
        initialValues={{
          proposal: "",
        }}
        onSubmit={async (values) => {
          mutation({ variables: {
            project_id, applicant_id, proposal: values.proposal          
          } });
          setState(false);
        }}
        validationSchema={Yup.object().shape({
          proposal: Yup.string().required("This field has to be a URL").url(),
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1>Update Proposal</h1>
            <label htmlFor="proposal" style={{ display: "block" }}>
              New proposal
            </label>
            <Field
              type="text"
              name="proposal"
              placeholder="Proposal Link"
            />
            <ErrorMessage
              className="input-feedback"
              name="proposal"
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

export const ChangePasswordForm = ({ mutation, setState, refresh }) => {
  return (
    <div>
      <Formik
        initialValues={{
          oldPassword: "",
          newPassword: "",
        }}
        onSubmit={async (values) => {
          mutation({ variables: {
            ...values, refresh         
          } });
          setState(false);
        }}
        validationSchema={Yup.object().shape({
          oldPassword: Yup.string().required("Required!"),
          newPassword: Yup.string().required("Required!"),
        })}
      >
        {({ isSubmitting }) => (
          <Form>
            <h1>Change Password</h1>
            <label htmlFor="oldPassword" style={{ display: "block" }}>
              Old Password
            </label>
            <Field
              type="password"
              name="oldPassword"
              placeholder="Old password"
            />
            <ErrorMessage
              className="input-feedback"
              name="oldPassword"
              component="div"
            />
            <label htmlFor="newPassword" style={{ display: "block" }}>
            New Password
          </label>
          <Field
            type="password"
            name="newPassword"
            placeholder="New password"
          />
          <ErrorMessage
            className="input-feedback"
            name="newPassword"
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
