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
  console.log("Entered");
  const { loading, data, error } = useQuery(getProjectApplicationsQuery, {
    variables: { id: projectId },
  });

  const [passFail] = useMutation(passFailApplicationMutation, {
    refetchQueries: ["getProjectApplicationsQuery"],
    onError(err) {
      console.log(err);
    },
  });

  const [acceptReject] = useMutation(acceptRejectApplicationMutation, {
    refetchQueries: ["getProjectApplicationsQuery"],
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
    <div className="container" style={{fontSize: "20px"}}>
    <h1 style={{marginTop: "60px"}}> Applications submitted to {data.project.name} </h1>
    <hr></hr>
      {data.project.applications.map((application, idx) => {
        
        console.log("Applications " + application);
        return (
          <div key={idx} style={{ margin:"50px 0"}} >
            <a href={application.proposal} style={{fontSize: "20px"}}>{application.applicant.first_name}</a>
            {now < startDate && application.proposal.accept && (
              <div className="actions">
                <button
                  onClick={() => {
                    acceptReject({
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
                    acceptReject({
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
            ) } { now > endDate && application.proposal.result == null && application.proposal.accepted && (
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
