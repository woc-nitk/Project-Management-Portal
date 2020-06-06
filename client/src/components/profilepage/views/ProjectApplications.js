import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  getProjectApplicationsQuery,
  acceptRejectApplicationMutation,
  passFailApplicationMutation,
} from "../../../queries";

export default function ProjectApplications({ match }) {
  const {
    params: { projectId },
  } = match;

  const { loading, data, error } = useQuery(getProjectApplicationsQuery, {
    variables: { id: projectId },
  });

  if (loading) return <h1>Loading...</h1>;

  if (error) {
    console.log(error);
    return <h1>Error occurred!</h1>;
  }

  [passFail] = useMutation(passFailApplicationMutation, {
    onError(err) {
      console.log(err);
    },
  });

  [acceptReject] = useMutation(acceptRejectApplicationMutation, {
    onError(err) {
      console.log(err);
    },
  });

  return (
    <div>
      {data.project.applications.map((application, idx) => {
        <div key={idx}>
          <a href={application.proposal}>{application.applicant.name}</a>
          {/* Display options depending on date here */}
          <div className="actions">
            <button
              onClick={() => {
                passFail({
                  variables: {
                    p_id: projectId,
                    appl_id: application.applicant.id,
                    accept: true,
                  },
                });
              }}
            >
              Accept
            </button>
            <button
              onClick={() => {
                passFail({
                  variables: {
                    p_id: projectId,
                    appl_id: application.applicant.id,
                    accept: false,
                  },
                });
              }}
            >
              Reject
            </button>
          </div>
          <div className="actions">
            <button
              onClick={() => {
                passFail({
                  variables: {
                    p_id: projectId,
                    appl_id: application.applicant.id,
                    pass: true,
                  },
                });
              }}
            >
              Pass
            </button>
            <button
              onClick={() => {
                passFail({
                  variables: {
                    p_id: projectId,
                    appl_id: application.applicant.id,
                    pass: false,
                  },
                });
              }}
            >
              Fail
            </button>
          </div>
        </div>;
      })}
    </div>
  );
}
