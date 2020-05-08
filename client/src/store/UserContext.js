import { createContext } from "react";
const user = {
  id: "",
  role: "",
  authToken: "",
  refreshToken: "",
};

export const UserContext = createContext(user);
