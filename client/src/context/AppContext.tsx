import React, { createContext, useContext, useEffect, useState } from "react";
import { Chapter, ChapterContent, Course } from "../types";
import { dummyCourses } from "../assets/assets";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";

type AppContextType = {
  currency?: string;
  allCourses: Course[];
  navigate: NavigateFunction;
  calculateRating: (course: Course) => number;
  setIsEducator?: React.Dispatch<React.SetStateAction<boolean>>;
  isEducator?: boolean;
  calculateChapterDuration: (chapter: Chapter) => string;
  calculateCourseDuration: (course: Course) => string;
  calcutateTotalChapters: (course: Course) => number;
  enrolledCourses: Course[];
  fetchEnrolledCourses: () => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = import.meta.env.VITE_CURRENCY || "USD";
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnroledCourses] = useState<Course[]>([]);

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

  // fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    setEnroledCourses(dummyCourses);
  };

  useEffect(() => {
    fetchAllCourses();
    fetchEnrolledCourses();
  }, []);

  const logToken = async () => {
    console.log(await getToken());
  };

  useEffect(() => {
    if (user) {
      logToken();
    }
  }, [user]);

  const calculateChapterDuration = (chapter: Chapter) => {
    let duration = 0;

    chapter.chapterContent.map((content: ChapterContent) => {
      duration += content.lectureDuration;
    });

    return humanizeDuration(duration * 60 * 1000, { units: ["h", "m"] });
  };

  const calculateCourseDuration = (course: Course) => {
    let duration = 0;
    course.courseContent.forEach((chapter) => {
      chapter.chapterContent.map((content: ChapterContent) => {
        duration = duration += content.lectureDuration;
      });
    });

    return humanizeDuration(duration * 60 * 1000, { units: ["h", "m"] });
  };

  const calcutateTotalChapters = (course: Course) => {
    let totalCourses = 0;

    course.courseContent.forEach((chapter) => {
      totalCourses += chapter.chapterContent.length;
    });

    return totalCourses;
  };

  const value: AppContextType = {
    currency,
    allCourses,
    navigate,
    calculateRating,
    setIsEducator,
    isEducator,
    calculateChapterDuration,
    calculateCourseDuration,
    calcutateTotalChapters,
    fetchEnrolledCourses,
    enrolledCourses,
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
