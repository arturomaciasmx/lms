import express from "express";
import { addUserRating, getUserCourseProgress, getUserData, getUserEnrolledCourses, purchaseCourse, updateUserCourseProgress } from "../controllers/userController.js";

const userRouter = express.Router();

// get user data
userRouter.get("/data", getUserData);
// get enrolled courses
userRouter.get("/enrolled-courses", getUserEnrolledCourses);
// purchase
userRouter.post("/purchase", purchaseCourse);
// user course progress
userRouter.post("/update-course-progress", updateUserCourseProgress);
// get course progress
userRouter.get("/get-course-progress", getUserCourseProgress);
// add course rating
userRouter.get("/add-course-rating", addUserRating);

export default userRouter;