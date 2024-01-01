import { Router } from "express";
import {
  signupTeacher,
  loginTeacher,
  createAssignment,
  checkAssignment,
  checkAssignmentForReDo,
  getAllAssignment,
  getAllResponses,
  getAllCorrected,
} from "../controllers/teacher.controller";

const router = Router();

router.post("/signupTeacher", signupTeacher);
router.post("/loginTeacher", loginTeacher);
router.post("/createAssignment", createAssignment);
router.post("/checkAssignment", checkAssignment);
router.post("/checkAssignmentForReDo", checkAssignmentForReDo);
router.get("/getAllAssignment", getAllAssignment);
router.post("/getAllResponses", getAllResponses);
router.post("/getAllCorrected", getAllCorrected);

export default router;
