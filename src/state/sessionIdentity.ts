import { createContext, useContext } from "react";

export type SessionIdentity = {
  name: string;
};

export const emptySessionIdentity: SessionIdentity = Object.freeze({ name: "" });

export function createSessionIdentity(name: string): SessionIdentity {
  return { name: name.trim() };
}

export const SessionIdentityContext = createContext<SessionIdentity>(emptySessionIdentity);

export function useSessionIdentity(): SessionIdentity {
  return useContext(SessionIdentityContext);
}
