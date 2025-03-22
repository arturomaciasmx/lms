import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppContext } from "../../context/AppContext";
import { Chapter, ChapterContent, Course } from "../../types";
import Loading from "../../components/student/Loading";
import { assets } from "../../assets/assets";
import humanizeDuration from "humanize-duration";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";

export default function CourseDetails() {
  const { id } = useParams();
  const [courseData, setCourseData] = useState<null | Course>(null);
  const [openSections, setOpenSections] = useState<{ [key: number]: boolean }>({});
  const [isAreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState<{ [key: string]: string | null } | null>(
    null
  );

  const {
    calculateRating,
    calculateChapterDuration,
    calculateCourseDuration,
    calcutateTotalChapters,
    currency,
    backendUrl,
    userData,
    getToken,
  } = useAppContext();

  const fetchCourseDetails = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/course/" + id);

      if (data.success) {
        setCourseData(data.course);
      } else {
        toast.error(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to enroll");
      }
      if (isAreadyEnrolled) {
        return toast.warn("Already enrolled");
      }

      const token = await getToken();
      console.log(token);

      const { data } = await axios.post(
        backendUrl + "/api/user/purchase",
        {
          courseId: courseData?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(courseData?._id);

      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  useEffect(() => {
    fetchCourseDetails();
  }, []);

  const toggleSection = (index: number) => {
    setOpenSections((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  return courseData ? (
    <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 pt-20 pb-20 text-left">
      <div className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-100/70 h-[500px] -z-10"></div>
      {/* left column */}
      <div className="w-2/3 z-10 text-gray-500">
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
          Course by <span className="text-blue-600">{courseData.educator.name}</span>
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
                              <p
                                className="text-blue-500 cursor-pointer"
                                onClick={() =>
                                  setPlayerData({
                                    videoId:
                                      chapterContent.lectureUrl.split("/").pop() || null,
                                  })
                                }
                              >
                                Preview
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
      <div className="max-w-xl w-1/3 z-10 shadow rounded-t md: rounded-none overflow-hidden min-w-[300px] bg-white sm:min-w-[420px]">
        {playerData ? (
          <YouTube
            videoId={playerData.videoId}
            opts={{
              playerVars: {
                autoplay: 1,
              },
            }}
            iframeClassName="w-full aspect-video"
          />
        ) : (
          <img src={courseData.courseThumbnail} alt={courseData.courseTitle} />
        )}

        <div className="py-5 px-5">
          <div className="flex items-center gap-2">
            <img
              src={assets.time_left_clock_icon}
              alt="Time left clock icon"
              className="w-3.5"
            />
            <p className="text-red-500">
              <span className="font-medium">5 days</span> left at this price!
            </p>
          </div>
          <div className="flex gap-3 items-center pt-2">
            <p className="text-gray-800 md:text-4xl text-2xl font-semibold">
              {currency}
              {(
                courseData.coursePrice -
                (courseData.discount * courseData.coursePrice) / 100
              ).toFixed(2)}
            </p>
            <p className="md:text-lg  text-gray-500 line-through">
              {currency}
              {courseData.coursePrice}
            </p>
            <p className="md:text-lg text-gray-500">{courseData.discount}% off</p>
          </div>
          <div className="flex items-center text-sm md:text-base gap-4 pt-2 md:pt-4 text-gray-500">
            <div className="flex items-center gap-1">
              <img src={assets.star} alt="star icon" />
              <p>{calculateRating(courseData)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img src={assets.time_clock_icon} alt="clock icon" />
              <p>{calculateCourseDuration(courseData)}</p>
            </div>
            <div className="h-4 w-px bg-gray-500/40"></div>
            <div className="flex items-center gap-1">
              <img src={assets.lesson_icon} alt="lesson icon" />
              <p>{calcutateTotalChapters(courseData)} lessons</p>
            </div>
          </div>
          <button
            className="md:mt-6 mt-4 bg-blue-600 rounded w-full py-3 text-white"
            onClick={
              !isAreadyEnrolled
                ? enrollCourse
                : () => {
                    return;
                  }
            }
          >
            {isAreadyEnrolled ? "Already enrolled" : "Enroll now"}
          </button>
          <div className="pt-6">
            <p className="font-medium text-xl text-gray-800">What's in the course</p>
            <ul className="ml-4 pt-2 text-sm md:text-base list-disc text-gray-500">
              <li>Lifetime access with free updates.</li>
              <li>Step-by-step, hands-on project guidance.</li>
              <li>Downloadable resources and source code.</li>
              <li>Quizzes to test your knowledge.</li>
              <li>Certificate</li>
              <li>Quizzes to test your knowledge.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
}
