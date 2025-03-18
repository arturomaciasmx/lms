import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Course } from "../../types";
import Loading from "../../components/student/Loading";

export default function MyCourses() {
  const { currency, allCourses } = useAppContext();
  const [courses, setCourses] = useState<Course[] | null>(null);

  useEffect(() => {
    setCourses(allCourses);
  }, [allCourses]);
  return courses ? (
    <div className="h-screen flex flex-col items-start justify-between md:p-8">
      <div className="w-full">
        <h2 className="pb-4">My courses</h2>
        <div className="flex flex-col items-center  w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="table-fixed md:table-auto w-full overflow-hidden">
            <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold truncate">All courses</th>
                <th className="px-4 py-3 font-semibold truncate">Earnings</th>
                <th className="px-4 py-3 font-semibold truncate">Students</th>
                <th className="px-4 py-3 font-semibold truncate">Published on</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {courses.map((course) => (
                <tr key={course._id} className="border-b border-gray-500/20">
                  <td className="md:px-4 md:pl-2 py-3 flex items-center space-x-3">
                    <img
                      className="w-16"
                      src={course.courseThumbnail}
                      alt={course.courseTitle}
                    />
                    <span className="truncate md:block hidden">{course.courseTitle}</span>
                  </td>
                  <td className="px-4 py-3 truncate">
                    {currency}
                    {Math.floor(
                      course.enrolledStudents.length *
                        (course.coursePrice -
                          (course.discount * course.coursePrice) / 100)
                    )}
                  </td>
                  <td className="px-4 py-3 truncate">{course.enrolledStudents.length}</td>
                  <td className="px-4 py-3 truncate">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
