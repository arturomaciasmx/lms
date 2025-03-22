import { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import { Line } from "rc-progress";
import axios from "axios";
import { toast } from "react-toastify";

export type ProgressArrayType = {
  totalLectures: number;
  lectureCompleted: number;
};

export default function MyEnrollments() {
  const {
    enrolledCourses,
    calculateCourseDuration,
    navigate,
    userData,
    fetchEnrolledCourses,
    backendUrl,
    getToken,
    calcutateTotalChapters,
  } = useAppContext();

  const [progressArray, setProgressArray] = useState<ProgressArrayType[]>([]);

  const getCourseProgress = async () => {
    try {
      const token = await getToken();
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(
            backendUrl + "/api/user/get-course-progress",
            {
              courseId: course._id,
            },
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const totalLectures = calcutateTotalChapters(course);
          const lectureCompleted = data.progressData
            ? data.progressData.lectureCompleted.length
            : 0;

          return { totalLectures, lectureCompleted };
        })
      );
      setProgressArray(tempProgressArray);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchEnrolledCourses();
    }
  }, []);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      getCourseProgress();
    }
  }, [enrolledCourses]);

  return (
    <>
      <div className="md:px-36 px-8 pt-10 pb-10">
        <h1 className="text-2xl font-semibold">My enrolments</h1>
        <table className="md:table-auto table-fixed w-full overflow-hidden border border-gray-500/20 mt-10">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left max-sm:hidden">
            <tr>
              <td className="px-4 py-3 font-semibold truncate">Course</td>
              <td className="px-4 py-3 font-semibold truncate">Duration</td>
              <td className="px-4 py-3 font-semibold truncate">Completed</td>
              <td className="px-4 py-3 font-semibold truncate">Status</td>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledCourses.map((course, i) => (
              <tr key={i} className="border-b border-gray-500/20">
                <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3">
                  <img
                    src={course.courseThumbnail}
                    alt={course.courseTitle}
                    className="w-14 sm:w-24 md:w-28"
                  />
                  <div className="flex-1">
                    <p className="mb-1 max-sm:text-sm">{course.courseTitle}</p>
                    <Line
                      strokeWidth={2}
                      percent={
                        progressArray[i]
                          ? (progressArray[i].lectureCompleted * 100) /
                            progressArray[i].totalLectures
                          : 0
                      }
                      className="bg-gray-300 rounded-full"
                      strokeColor="#165dfb"
                    />
                  </div>
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {calculateCourseDuration(course)}
                </td>
                <td className="px-4 py-3 max-sm:hidden">
                  {progressArray[i] &&
                    `${progressArray[i].lectureCompleted} / ${progressArray[i].totalLectures}`}{" "}
                  <span>Lectures</span>
                </td>
                <td className="px-4 py-3 ">
                  <button
                    className="px-3 smpx5
                   py-1.5 bg-blue-600 max-sm:text-xs text-white cursor-pointer"
                    onClick={() => navigate("/player/" + course._id)}
                  >
                    {progressArray[i] &&
                    progressArray[i].lectureCompleted === progressArray[i].totalLectures
                      ? "Completed"
                      : "On going"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
