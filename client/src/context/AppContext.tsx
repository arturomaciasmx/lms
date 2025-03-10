import React, { createContext, useContext, useEffect, useState } from "react";
import { Course } from "../types";
import { dummyCourses } from "../assets/assets";
import { type NavigateFunction, useNavigate } from "react-router-dom";

type AppContextType = {
  currency?: string;
  allCourses: Course[];
  navigate: NavigateFunction;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = import.meta.env.VITE_CURRENCY || "USD";
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState<Course[]>([]);

  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const value: AppContextType = {
    currency,
    allCourses,
    navigate,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("AppContext must be used whithin AppContextProvider");
  }
  return context;
}
