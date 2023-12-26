import { Router } from "express";
import {
  signupTeacher,
  loginTeacher,
  createAssignment,
  checkAssignment,
} from "../controllers/teacher.controller";

const router = Router();

router.post("/signupTeacher", signupTeacher);
router.post("/loginTeacher", loginTeacher);
router.post("/createAssignment", createAssignment);
router.post("/checkAssignment", checkAssignment);

export default router;
