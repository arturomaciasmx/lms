import React, { createContext, useContext, useEffect, useState } from "react";
import { Chapter, ChapterContent, Course, User } from "../types";
import { type NavigateFunction, useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import { useAuth, useUser } from "@clerk/clerk-react";
import axios from "axios";
import { toast } from "react-toastify";

type AppContextType = {
  currency?: string;
  allCourses: Course[];
  navigate: NavigateFunction;
  calculateRating: (course: Course) => number;
  setIsEducator: React.Dispatch<React.SetStateAction<boolean>>;
  isEducator?: boolean;
  calculateChapterDuration: (chapter: Chapter) => string;
  calculateCourseDuration: (course: Course) => string;
  calcutateTotalChapters: (course: Course) => number;
  enrolledCourses: Course[];
  fetchEnrolledCourses: () => void;
  backendUrl: string;
  userData: User | null;
  setUserData: React.Dispatch<React.SetStateAction<User | null>>;
  getToken: () => Promise<string | null>;
  fetchAllCourses: () => Promise<void>;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider = ({ children }: { children: React.ReactNode }) => {
  const currency = import.meta.env.VITE_CURRENCY || "USD";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const { getToken } = useAuth();
  const { user } = useUser();

  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [isEducator, setIsEducator] = useState(false);
  const [enrolledCourses, setEnroledCourses] = useState<Course[]>([]);
  const [userData, setUserData] = useState<User | null>(null);

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/all");
      if (data.success) {
        setAllCourses(data.courses);
      } else {
        toast.error(data.message);
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const fetchUserData = async () => {
    if (user?.publicMetadata.role === "educator") setIsEducator(true);
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Calculate course rating
  const calculateRating = (course: Course) => {
    if (course.courseRatings.length === 0) return 0;

    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return Math.floor(totalRating / course.courseRatings.length);
  };

  // fetch enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(backendUrl + "/api/user/enrolled-courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (data.success) {
        setEnroledCourses(data.enrolledCourses.reverse());
      } else {
        toast.error(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchEnrolledCourses();
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
    backendUrl,
    fetchAllCourses,
    getToken,
    setUserData,
    userData,
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
