import { createContext } from "react";
const user = {
  id: "",
  role: "",
  auth: "",
  refresh: "",
};

export const UserContext = createContext(user);
