import { Router } from "express";
import { getPdfFileById } from "../controllers/files.controller";

const router = Router();

router.get("/:fileId", getPdfFileById);

export default router;
