import React from "react";

export default function About() {
  return (
    <div className="container" style={{
      fontSize:"20px"
    }}>
    <h1
    style={{
      fontSize: "36px",
      marginTop: "60px",
      marginBottom: "5px",
    }}
  >
    About us
  </h1>
  <hr
    style={{
      flex: "0 0 100%",
      marginBottom: "50px",
    }}
  />
      <p>
      Open source software is software with source code that anyone can inspect, modify, and enhance. Such a software is usually developed in a collaborative public manner, involving developers of all experience levels.
There are many programs focused on bringing more student developers into open source software development by suitably rewarding their contributions. 
</p><br></br>
<p>This portal facilitates such programs to encourage contributions from students to Open Source projects.
This application is capable of managing all the entities involved in the process of contribution, i.e., the Open source organization, its administrators, its mentors, their projects, and the applicants who apply to work on its projects.
The applicants, (students who wish to contribute to the projects listed on the portal) will be able to sign up on the portal by providing their details and submit proposals to different mentors. The mentors, organization administrators, and the super admins (portal maintainers) can select proposals that suit their requirements. 
The information about the projects and organizations will be made available to all users, regardless of whether they apply to a project or register as an applicant.

      </p>
    </div>
  );
}
