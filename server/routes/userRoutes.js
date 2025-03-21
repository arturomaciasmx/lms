import express from "express";
import { getUserData, getUserEnrolledCourses, purchaseCourse } from "../controllers/userController.js";

const userRouter = express.Router();

// get user data
userRouter.get("/data", getUserData);
// get enrolled courses
userRouter.get("/enrolled-courses", getUserEnrolledCourses);
// purchase
userRouter.post("/purchase", purchaseCourse);

export default userRouter;