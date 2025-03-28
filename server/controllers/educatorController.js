import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";

// update role to educator
export const updateRoleToEducator = async (req, res) => {
  try {
    const userId = req.auth.userId;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: "educator"
      }
    });

    res.json({ success: true, message: "You can publish a course now" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// add new course
export const addCourse = async (req, res) => {
  try {
    const { courseData } = req.body;
    console.log(req);

    const imageFile = req.file;
    const educatorId = req.auth.userId;

    // return if not image
    if (!imageFile) return res.json({ success: false, message: "Thumbnail not atached" });

    const parsedCourseData = await JSON.parse(courseData);
    parsedCourseData.educator = educatorId;

    const newCourse = await Course.create(parsedCourseData);


    // upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path);


    newCourse.courseThumbnail = imageUpload.secure_url;
    await newCourse.save();

    res.json({ success: true, message: "Course added" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    return res.json({ success: true, courses });
  } catch (error) {
    return res.json({ success: true, message: error.message });
  }
};

// get educator dashboard data (total earnings, enrolled students, no. of courses)
export const getEducatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;
    const courseIds = courses.map(course => course._id);

    // calculate total earnings from purchases
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    });

    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    // collect unique enrolled student ids with their course title
    const enrolledStudentsData = [];
    for (const course of courses) {
      const students = await User.find({
        _id: { $in: course.enrolledStudents }
      }, "name imageUrl");

      students.forEach(student => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student
        });
      });
    }
    return res.json({ success: true, dashboardData: { totalEarnings, enrolledStudentsData, totalCourses } });
  } catch (error) {
    console.log("🚀 ~ educatorController.js:100 ~ getEducatorDashboardData ~ error:", error);

    return res.json({ success: false, message: error.message });
  }
};

// get enrolled students data with purchase data
export const getEnrolledStudentsData = async (req, res) => {
  try {
    const educator = req.auth.userId;
    const courses = await Course.find({ educator });
    const courseIds = courses.map(course => course._id);

    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: "completed"
    }).populate("userId", "name imageUrl").populate("courseId", "courseTitle");
    console.log("🚀 ~ educatorController.js:115 ~ getEnrolledStudentsData ~ purchases:", purchases);


    const enrolledStudents = purchases.map(purchase => ({
      student: purchase.userId,
      courseTitle: purchase.courseId.courseTitle,
      purchaseDate: purchase.createdAt
    }));

    return res.json({ success: true, enrolledStudents });

  } catch (error) {
    console.log("🚀 ~ educatorController.js:126 ~ getEnrolledStudentsData ~ error:", error);
    return res.json({ success: false, message: error.message });
  }
};