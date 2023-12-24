import express from "express";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./service/database.service";

const app = express();
app.use(cookieParser());

app.use(express.json());

import studentRoutes from "./routes/student.routes";
import teacherRoutes from "./routes/teacher.routes";
app.use("/student", studentRoutes);
app.use("/teacher", teacherRoutes);

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
