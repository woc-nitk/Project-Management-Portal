import { createContext } from "react";
const user = {
  id: "",
  type: "",
  auth: "",
  refresh: "",
};

export const UserContext = createContext(user);
