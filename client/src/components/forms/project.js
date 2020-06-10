import React from "react";
//import "./forms.css";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ApplicantForm = props => {
  return (
    <div className="app">
      <Formik
        initialValues={{
          name: "",
          work: "",
          deliverables: "",
          projectStartDate: "",
          projectEndDate: "",
          prerequisite1: "",
          prerequisite2: "",
          prerequisite3: "",
          prerequisite4: "",
          mentor1: "",
          mentor2: ""
        }}
        onSubmit={(values, { setSubmitting }) => alert(values)}
        validationSchema={Yup.object().shape({
          name: Yup.string().required("Required"),
          work: Yup.string().required("Required"),
          deliverables: Yup.string().required("Required"),
          prerequisite1: Yup.date().required("Required"),
          projectStartDate: Yup.date().required("Required"),
          projectEndDate: Yup.string().required("Required"),
          mentor1: Yup.string().required("Required")
        })}
      >
        {({ dirty, handleReset, isSubmitting, setFieldValue, values }) => (
          <Form>
            <h1
              style={{
                marginBottom: "2rem",
                fontSize: "42px"
              }}
            >
              Add Project
            </h1>
            <label htmlFor="name" style={{ display: "block" }}>
              Name of the project
            </label>
            <Field
              type="text"
              name="name"
              placeholder="Enter the project name"
            />
            <ErrorMessage
              className="input-feedback"
              name="name"
              component="div"
            />
            <label htmlFor="work" style={{ display: "block" }}>
              Work to be done
            </label>
            <Field
              component="textArea"
              name="work"
              placeholder="Enter the work to be done"
            />
            <ErrorMessage
              className="input-feedback"
              name="work"
              component="div"
            />
            <label htmlFor="deliverables" style={{ display: "block" }}>
              Deliverables
            </label>
            <Field
              component="textarea"
              name="deliverables"
              placeholder="Enter the Deliverables"
            />
            <ErrorMessage
              className="input-feedback"
              name="deliverables"
              component="div"
            />
            <label htmlFor="projectStartDate" style={{ display: "block" }}>
              Project Start Date
            </label>
            <DatePicker
              selected={values.projectStartDate}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              name="projectStartDate"
              placeholderText="date"
              onChange={date => setFieldValue("projectStartDate", date)}
            />
            <ErrorMessage
              className="input-feedback"
              name="projecyStartDate"
              component="div"
            />
            <label htmlFor="projectEndDate" style={{ display: "block" }}>
              Project End Date
            </label>
            <DatePicker
              selected={values.projectEndDate}
              dateFormat="MMMM d, yyyy"
              className="form-control"
              name="projectEndDate"
              placeholderText="date"
              onChange={date => setFieldValue("projectEndDate", date)}
            />
            <ErrorMessage
              className="input-feedback"
              name="projectEndDate"
              component="div"
            />

            <label htmlFor="prerequisite1" style={{ display: "block" }}>
              Prerequisites
            </label>
            <Field
              type="text"
              name="prerequisite1"
              placeholder="Enter the first prerequisite"
            />
            <ErrorMessage
              className="input-feedback"
              name="prerequisite1"
              component="div"
            />
            <label htmlFor="prerequisite2" style={{ display: "block" }}>
              Prerequisites
            </label>
            <Field
              type="text"
              name="prerequisite2"
              placeholder="Enter the second prerequisite"
            />
            <ErrorMessage
              className="input-feedback"
              name="prerequisite2"
              component="div"
            />
            <label htmlFor="prerequisite3" style={{ display: "block" }}>
              Prerequisites
            </label>
            <Field
              type="text"
              name="prerequisite3"
              placeholder="Enter the third prerequisite"
            />
            <ErrorMessage
              className="input-feedback"
              name="prerequisite3"
              component="div"
            />
            <label htmlFor="prerequisite4" style={{ display: "block" }}>
              Prerequisites
            </label>
            <Field
              type="text"
              name="prerequisite4"
              placeholder="Enter the fourth prerequisite"
            />
            <ErrorMessage
              className="input-feedback"
              name="prerequisite4"
              component="div"
            />
            <label htmlFor="prerequisite1" style={{ display: "block" }}>
              Mentor
            </label>
            <Field type="text" name="mentor1" placeholder="mentor" />
            <ErrorMessage
              className="input-feedback"
              name="mentor1"
              component="div"
            />
            <label htmlFor="mentor2" style={{ display: "block" }}>
              Mentor(optional)
            </label>
            <Field type="text" name="mentor2" placeholder="mentor" />
            <ErrorMessage
              className="input-feedback"
              name="mentor2"
              component="div"
            />
            <br />
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

export default ApplicantForm;
