import React, { createContext, useContext, useEffect, useState } from "react";
import { Course } from "../types";
import { dummyCourses } from "../assets/assets";
import { type NavigateFunction, useNavigate } from "react-router-dom";

type AppContextType = {
  currency?: string;
  allCourses: Course[];
  navigate: NavigateFunction;
  calculateRating: (course: Course) => number;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = import.meta.env.VITE_CURRENCY || "USD";
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState<Course[]>([]);

  // Fetch all courses
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Calculate course rating
  const calculateRating = (course: Course) => {
    if (course.courseRatings.length === 0) return 0;

    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const value: AppContextType = {
    currency,
    allCourses,
    navigate,
    calculateRating,
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
