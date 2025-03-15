import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Chapter, ChapterContent, Course } from "../../types";
import { useEffect, useState } from "react";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import Rating from "../../components/student/Rating";

type playerContentType = ChapterContent & {
  [key: string]: string | number | boolean | null;
};

export default function Player() {
  const { enrolledCourses, calculateChapterDuration } = useAppContext();
  const { courseId } = useParams();
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  const [playerData, setPlayerData] = useState<playerContentType | null>(null);

  useEffect(() => {
    enrolledCourses.map((course: Course) => {
      if (course._id === courseId) {
        setCourseData(course);
      }
    });
  }, [enrolledCourses, courseId]);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <>
      <div
        className="p-4 sm:p-10 flex flex-col-reverse md:grid md:grid-cols-2 gap-10
      md:px-36"
      >
        {/* left column */}
        <div className="text-gray-800">
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
                    {chapter.chapterContent.map(
                      (chapterContent: ChapterContent, index) => (
                        <li key={index} className="flex items-start gap-2 py-1">
                          <img
                            src={false ? assets.play_icon : assets.blue_tick_icon}
                            alt="Play icon"
                            className="w-4 h-4 mt-1"
                          />
                          <div className="flex items-center justify-between w-full text-gray-800 text-xs md:text-base">
                            <p>{chapterContent.lectureTitle}</p>
                            <div className="flex gap-2">
                              {chapterContent.lectureUrl && (
                                <p
                                  className="text-blue-500 cursor-pointer"
                                  onClick={() =>
                                    setPlayerData({
                                      ...chapterContent,
                                      chapter: i + 1,
                                      lecture: index + 1,
                                    })
                                  }
                                >
                                  Whatch
                                </p>
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
                      )
                    )}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 py-3 mt-10">
            <h2 className="text-2xl">Rate this course</h2>
            <Rating initialRating={0} />
          </div>
        </div>
        {/* right column */}
        <div>
          {playerData ? (
            <div className="md:mt-10">
              <YouTube
                videoId={playerData?.lectureUrl?.split("/").pop()}
                iframeClassName="w-full aspect-video"
              />
              <div className="flex justify-between items-center mt-2">
                <p>
                  {playerData.chapter}.{playerData.lecture} {playerData.lectureTitle}
                </p>
                <button className="text-blue-600 cursor-pointer">
                  {false ? "Completed" : "Mark complete"}
                </button>
              </div>
            </div>
          ) : (
            <img
              src={courseData ? courseData.courseThumbnail : ""}
              alt={courseData.courseTitle}
            />
          )}
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
}
