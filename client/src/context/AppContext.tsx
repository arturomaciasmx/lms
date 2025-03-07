import React, { createContext } from "react";

export const AppContext = createContext({});

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {};
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
