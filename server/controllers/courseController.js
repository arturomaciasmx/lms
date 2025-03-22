import Course from "../models/Course.js";


// get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).select(["-courseContent", "-enrolledStudents"]).populate({ path: "educator", select: "_id name imageUrl" });
    return res.json({ success: true, courses });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// get course by id
export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await Course.findById(id).populate({ path: "educator" });
    // remove lecture url if isPreviewFree is false
    course.courseContent.forEach(chapter => {
      chapter.chapterContent.forEach(lecture => {
        if (!lecture.isPreviewFree) {
          lecture.url = "";
        }
      });
    });

    return res.json({ success: true, course });

  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

