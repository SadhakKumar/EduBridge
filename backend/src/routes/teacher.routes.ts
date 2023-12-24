import { Router } from "express";
import {
  signupTeacher,
  loginTeacher,
  createAssignment,
} from "../controllers/teacher.controller";

const router = Router();

router.post("/signupTeacher", signupTeacher);
router.post("/loginTeacher", loginTeacher);
router.post("/createAssignment", createAssignment);

export default router;
