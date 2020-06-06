import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";
import MentorProfile from "./MentorProfile";
import ApplicantProfile from "./ApplicantProfile";
import { Link } from "react-router-dom";

export default function Profile() {
  const user = useContext(UserContext);
  if (!user.type) {
    return (
      <h1>
        Please <Link to="/login">login</Link> or{" "}
        <Link to="/signup">signup</Link> to see your profile
      </h1>
    );
  } else if (user.type === "applicant") {
    return <ApplicantProfile />;
  } else if (user.type === "mentor") {
    return <MentorProfile />;
  }
}
