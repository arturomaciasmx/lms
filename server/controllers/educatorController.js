import { clerkClient } from "@clerk/express";
import Course from "../models/Course.js";
import { v2 as cloudinary } from "cloudinary";

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
    const imageFile = req.file;
    const educatorId = req.auth.userId;

    // return if not image
    if (!imageFile) return res.json({ success: false, message: "Thumbnail not atached" });
    console.log("🚀 ~ educatorController.js:32 ~ addCourse ~ imageFile:", imageFile);

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