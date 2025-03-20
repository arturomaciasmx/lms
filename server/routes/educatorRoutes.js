import express from "express";
import { addCourse, getEducatorCourses, getEducatorDashboardData, getEnrolledStudentsData, updateRoleToEducator } from "../controllers/educatorController.js";
import upload from "../config/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";

const educatorRouter = express.Router();

// add educator role
educatorRouter.get("/update-role", updateRoleToEducator);
// add course
educatorRouter.post("/add-course", upload.single("image"), protectEducator, addCourse);
// get courses
educatorRouter.get("/courses", protectEducator, getEducatorCourses);
// educator data
educatorRouter.get("/dashboard", protectEducator, getEducatorDashboardData);
// enrolled students
educatorRouter.get("/enrolled-students", protectEducator, getEnrolledStudentsData);


export default educatorRouter;