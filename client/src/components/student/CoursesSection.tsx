import { Link } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import CourseCard from "./CourseCard";

export default function CoursesSection() {
  const { allCourses } = useAppContext();
  return (
    <div className="py-16 text-center container mx-auto">
      <h2 className="">Learn from the best</h2>
      <p className="text-sm md:text-base text-gray-500 mt-3">
        Discover our top-rated courses across various categories. From coding and design
        to business and wellness, our courses are crafted to deliver results.
      </p>
      <div className="grid grid-cols-2 lg:grid-cols-4 my-10 gap-8">
        {allCourses.slice(0, 4).map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
      <Link
        to={"/course-list"}
        onClick={() => {
          scrollTo(0, 0);
        }}
        className="text-gray-500 border border-gray-500/30 px-10 py-3 rounded mt-4 inline-block"
      >
        Show all courses
      </Link>
    </div>
  );
}
