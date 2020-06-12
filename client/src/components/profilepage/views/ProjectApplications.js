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

  const [passFail] = useMutation(passFailApplicationMutation, {
    onError(err) {
      console.log(err);
    },
  });

  const [acceptReject] = useMutation(acceptRejectApplicationMutation, {
    onError(err) {
      console.log(err);
    },
  });

  if (loading) return <h1>Loading...</h1>;

  if (error) {
    console.log(error);
    return <h1>Error occurred!</h1>;
  }

  const startDate = new Date(`${data.project.project_start_date}`).getTime();
  const endDate = new Date(`${data.project.project_end_date}`).getTime();
  const now = new Date().getTime();

  return (
    <div>
      {data.project.applications.map((application, idx) => {
        return (
          <div key={idx}>
            <a href={application.proposal}>{application.applicant.name}</a>
            {now < startDate ? (
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
            ) : (
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
            )}
          </div>
        );
      })}
    </div>
  );
}
