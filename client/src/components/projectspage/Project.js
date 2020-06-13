import React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { getProjectQuery, addApplicationMutation } from "../../queries";
import AppicationForm from "../forms/application";

export default function Projects({ match, user }) {
  const {
    params: { projectId },
  } = match;

  const [success, setSucc] = React.useState(false);
  const [er, serError] = React.useState(false);

  const { loading, data, error } = useQuery(getProjectQuery, {
    variables: { id: projectId },
  });

  const [addApplication] = useMutation(addApplicationMutation, {
    onComplete() {
      setSucc(true);
    },
    onError(err) {
      serError(true);
      console.log(err);
    },
  });
  if (loading) {
    return <h1>Loading...</h1>;
  }
  if (error) {
    console.log(error);
    return <h1>Error fetching projects</h1>;
  }

  return (
    <div key={user.id} className="container" style={{ fontSize: "20px" }}>
      {success && (
        <div className="input-feedback" style={{ color: "var(--green)" }}>
          Successfully applied to project
        </div>
      )}
      {er && <div className="input-feedback">Some error occurred</div>}
      <h1 style={{ marginTop: "40px", marginBottom: "10px", fontSize:"3em" }}>{data.project.name}</h1>
      <h3 style={{ marginTop: "40px", marginBottom: "10px" }}>Work:</h3>
      <p>{data.project.work}</p>
      <h3 style={{ marginTop: "40px", marginBottom: "10px" }}>Deliverables:</h3>
      <p>{data.project.deliverables}</p>
      <h4 style={{ marginTop: "40px", marginBottom: "10px" }}>
        Prerequisites:
      </h4>
      <ul>
        {data.project.prerequisites.map((p, idx) => {
          if (p) {
            return <li key={idx}>{p}</li>;
          } else return null;
        })}
      </ul>
      <h4 style={{ marginTop: "40px", marginBottom: "10px" }}>
        Project Mentors:
      </h4>
      <ul>
        {data.project.mentors.map((p, idx) => {
          return <li key={idx}>{p.name}</li>;
        })}
      </ul>

      {user.type === "applicant" && (
        <AppicationForm
          pId={projectId}
          aId={user.id}
          mutation={addApplication}
        />
      )}
    </div>
  );
}
