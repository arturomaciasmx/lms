import express from "express";
import { getAllCourses, getCourseById } from "../controllers/courseController.js";

const courseRouter = express.Router();

// get all courses
courseRouter.get("/all", getAllCourses);
// get course by id
courseRouter.get("/:id", getCourseById);

export default courseRouter;