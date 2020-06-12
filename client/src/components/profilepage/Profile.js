import React from "react";
import MentorProfile from "./MentorProfile";
import ApplicantProfile from "./ApplicantProfile";
import SuperAdminProfile from "./SuperAdminProfile";
import OrgAdminProfile from "./OrgAdminProfile";
import { Link } from "react-router-dom";

export default function Profile({ user }) {
  function Display(type) {
    switch (type) {
      case "applicant":
        return <ApplicantProfile />;
      case "mentor":
        return <MentorProfile />;
      case "orgAdmin":
        return <OrgAdminProfile />;
      case "superAdmin":
        return <SuperAdminProfile />;
      default:
        return (<h1><Link to="/signup">Sign Up</Link> or <Link to="/login">Login</Link></h1>);
    }
  }

  return <div key={user.id} className="container"> {Display(user.type)}</div>;
}
