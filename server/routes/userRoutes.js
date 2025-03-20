import express from "express";
import { getUserData, getUserEnrolledCourses } from "../controllers/userController.js";

const userRouter = express.Router();

// get user data
userRouter.get("/data", getUserData);
// get enrolled courses
userRouter.get("/enrolled-courses", getUserEnrolledCourses);

export default userRouter;