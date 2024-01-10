import express from "express";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./service/database.service";
import fileUpload from "express-fileupload";
import cors from "cors";

const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());

app.use(express.json());
app.use(fileUpload());

import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";
import userRoutes from "./routes/user.routes";
import fileRouter from "./routes/files.routes";
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);
app.use("/user", userRoutes);
app.use("/files", fileRouter);

connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Express is listening at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
