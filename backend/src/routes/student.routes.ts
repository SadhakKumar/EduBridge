import { Router } from "express";
import {
  signupStudent,
  loginStudent,
  getStudentInfo,
  getPendingAssignments,
  updateAssignmnet,
} from "../controllers/student.controller";

const router = Router();

router.post("/signupstudent", signupStudent);
router.post("/loginstudent", loginStudent);
router.get("/getstudentinfo", getStudentInfo);
router.get("/getpendingassignments", getPendingAssignments);
router.post("/updateassignment", updateAssignmnet);

export default router;
