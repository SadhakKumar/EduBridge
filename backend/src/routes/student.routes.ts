import { Router } from "express";
import {
  signupStudent,
  loginStudent,
  getStudentInfo,
  getPendingAssignments,
  updateAssignmnet,
  submitAssignment,
} from "../controllers/student.controller";

const router = Router();

router.post("/signupstudent", signupStudent);
router.post("/loginstudent", loginStudent);
router.get("/getstudentinfo", getStudentInfo);
router.get("/getpendingassignments", getPendingAssignments);
router.post("/updateassignment", updateAssignmnet);
router.post("/submitassignment", submitAssignment);

export default router;
