import { Router } from "express";
import {
  signupStudent,
  loginStudent,
  getStudentInfo,
  getPendingAssignments,
  getCompletedAssignments,
  getSubmittedAssignments,
  getRedoAssignments,
  updateAssignmnet,
  submitAssignment,
  submitRedoAssignment,
} from "../controllers/student.controller";

const router = Router();

router.post("/signupstudent", signupStudent);
router.post("/loginstudent", loginStudent);
router.get("/getstudentinfo", getStudentInfo);
router.get("/getpendingassignments", getPendingAssignments);
router.get("/getcompletedassignments", getCompletedAssignments);
router.get("/getsubmittedassignments", getSubmittedAssignments);
router.get("/getredoassignments", getRedoAssignments);
router.post("/updateassignment", updateAssignmnet);
router.post("/submitassignment", submitAssignment);
router.post("/submitredoassignment", submitRedoAssignment);

export default router;
