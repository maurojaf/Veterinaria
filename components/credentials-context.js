import { createContext } from "react";

//credencials context
export const CredentialsContext = createContext({
  storedCredentials: {},
  setStoredCredentials: () => {},
});
