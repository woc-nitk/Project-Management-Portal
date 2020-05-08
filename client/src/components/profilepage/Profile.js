import React, { useContext } from "react";
import { UserContext } from "../../store/UserContext";

export default function Profile() {
  const user = useContext(UserContext);
  return <div></div>;
}
