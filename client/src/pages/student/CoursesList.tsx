import { useParams } from "react-router-dom";
import SearchBar from "../../components/student/SearchBar";
import { useAppContext } from "../../context/AppContext";
import { Course } from "../../types";
import CourseCard from "../../components/student/CourseCard";
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";

export default function CoursesList() {
  const { navigate, allCourses } = useAppContext();
  const { input } = useParams();
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (allCourses && allCourses.length > 0) {
      const tempCourses = allCourses.slice();

      if (!input) {
        setFilteredCourses(tempCourses);
      } else {
        setFilteredCourses(
          tempCourses.filter((course) =>
            course.courseTitle.toLowerCase().includes(input.toLowerCase())
          )
        );
      }
    }
  }, [allCourses, input]);
  return (
    <>
      <div className="relative container pt-20 mx-auto text-left">
        <div className="flex md:flex-row flex-col gap-6 items-start justify-between">
          <div>
            <h1 className="text-4xl font-semibold text-gray-800">Course list</h1>
            <p className="text-gray-500 cursor-pointer">
              <span className="text-blue-600" onClick={() => navigate("/")}>
                Home
              </span>{" "}
              / Course list
            </p>
          </div>
          <SearchBar data={input} />
        </div>
        {input && (
          <div className="inline-flex items-center gap-4 px-4 py-2 border border-gray-500 mt-8 text-gray-600">
            <p>{input} </p>
            <img
              src={assets.cross_icon}
              alt="Cross icon"
              className="cursor-pointer"
              onClick={() => navigate("/course-list")}
            />
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 py-20">
          {filteredCourses.map((course: Course, i) => (
            <CourseCard key={i} course={course} />
          ))}
        </div>
      </div>
    </>
  );
}
