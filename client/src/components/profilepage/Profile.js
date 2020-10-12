import React from "react";
import MentorProfile from "./MentorProfile";
import ApplicantProfile from "./ApplicantProfile";
import SuperAdminProfile from "./SuperAdminProfile";
import OrgAdminProfile from "./OrgAdminProfile";
import { Link } from "react-router-dom";
// import { getAT } from '../../store/auth';



export default function Profile({ user, setUser }) {
  // console.log(getAT());
  function Display(type) {
    switch (type) {
      case "applicant":
        return <ApplicantProfile user={user} setUser={setUser} />;
      case "mentor":
        return <MentorProfile user={user} setUser={setUser} />;
      case "orgAdmin":
        return <OrgAdminProfile user={user} setUser={setUser} />;
      case "superAdmin":
        return <SuperAdminProfile user={user} setUser={setUser} />;
      default:
        return (<p><Link to="/signup">Sign Up</Link> or <Link to="/login">Login</Link></p>);
    }
  }

  return <div key={user.id} className="container" style={{
    fontSize: "16px"
  }}> <h1 style={{ fontSize: "36px" }}>Dashboard</h1>{Display(user.type)}</div>;
}
