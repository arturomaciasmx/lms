import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Chapter, ChapterContent, Course } from "../../types";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";

export default function CourseDetails() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState<null | Course>(null);
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  const {
    allCourses,
    calculateRating,
    calculateChapterDuration,
    calculateCourseDuration,
    calcutateTotalChapters,
  } = useAppContext();

  useEffect(() => {
    const findCourse = allCourses.find((course) => course._id == id);
    if (findCourse) setCourseData(findCourse);
  }, [allCourses, id]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 pb-20 text-left">
      <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-100/70 h-[500px] -z-10"></div>
      {/* left column */}
      <div className="max-w-xl z-10 text-gray-500">
        <h1 className="text-4xl font-semibold text-gray-800">{courseData.courseTitle}</h1>
        <div
          className="pt-4"
          dangerouslySetInnerHTML={{
            __html: courseData.courseDescription.slice(0, 200) + "...",
          }}
        ></div>
        {/* review and ratings */}
        <div className="flex items-center space-x-2 pt-4">
          <p>{calculateRating(courseData)}</p>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <img
                src={
                  i < Math.floor(calculateRating(courseData))
                    ? assets.star
                    : assets.star_blank
                }
                alt="Star rating"
                key={i}
                className="w-3.5 h-3.5"
              />
            ))}
          </div>
          <p className="text-blue-600">
            ({courseData.courseRatings.length}{" "}
            {courseData.courseRatings.length != 1 ? "reviews" : "review"})
          </p>
          <p>
            {courseData.enrolledStudents.length}{" "}
            {courseData.enrolledStudents.length != 1 ? "students" : "student"}
          </p>
        </div>
        <p className="pt-4">
          Course by <span className="text-blue-600">Joel Macias</span>
        </p>
        <div className="text-gray-800 pt-8">
          <h2>Course structure</h2>
          <div className="pt-5">
            {courseData.courseContent.map((chapter: Chapter, i) => (
              <div key={i} className="border border-gray-300 bg-white mb-2">
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer select-none"
                  onClick={() => toggleSection(i)}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={assets.down_arrow_icon}
                      alt="Down arrow icon"
                      className={`transform transition-transform ${
                        openSections[i] ? "rotate-180" : ""
                      }`}
                    />
                    <p className="font-medium md:text-base text-sm">
                      {chapter.chapterTitle}
                    </p>
                  </div>
                  <p className="text-sm md:text-base">
                    {chapter.chapterContent.length} lectures -{" "}
                    {calculateChapterDuration(chapter)}
                  </p>
                </div>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openSections[i] ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <ul className="list-disc md:pl-4 pr-4 py-2 text-gray-600 border-t border-gray-300">
                    {chapter.chapterContent.map((chapterContent: ChapterContent, i) => (
                      <li key={i} className="flex items-start gap-2 py-1">
                        <img
                          src={assets.play_icon}
                          alt="Play icon"
                          className="w-4 h-4 mt-1"
                        />
                        <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-base">
                          <p>{chapterContent.lectureTitle}</p>
                          <div className="flex gap-2">
                            {chapterContent.isPreviewFree && (
                              <p className="text-blue-500 cursor-pointer">Preview</p>
                            )}
                            <p>
                              {humanizeDuration(
                                chapterContent.lectureDuration * 60 * 1000,
                                {
                                  units: ["h", "m"],
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>Course description</h2>
          <div
            className="pt-3 rich-text"
            dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
          ></div>
        </div>
      </div>
      {/* right column */}
      <div></div>
    </div>
  ) : (
    <Loading />
  );
}
