import { Request, Response } from "express";
import { ObjectId, GridFSBucketWriteStream } from "mongodb";
import { student } from "../models/student";
import { studentAssignment } from "../models/assignment";
import { collection, gridfsBucket } from "../service/database.service";
import { Readable } from "stream";
import Jwt from "jsonwebtoken";
import bycrypt from "bcrypt";

// ==== Function starts here ==== //

const signupStudent = async (req: Request, res: Response) => {
  try {
    const newStudent: student = req.body;
    const findIfStudentExists = await collection.students?.findOne({
      email: newStudent.email,
    });
    if (findIfStudentExists) {
      return res.status(400).json({ message: "Student already exists" });
    }
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(newStudent.password, salt);
    newStudent.password = hashedPassword;
    const result = await collection.students?.insertOne(newStudent);
    if (result?.acknowledged) {
      res.status(201).json({ message: "Student created successfully" });
    } else {
      res.status(500).json({ message: "Could not create student" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not create student" });
  }
};

const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please enter email and password" });
    }
    const user = await collection.students?.findOne({ email });

    if (user) {
      const isPasswordCorrect = await bycrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const token = Jwt.sign(
          { email: user.email, id: user._id, role: "student" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("userInfo", token);
        res.status(200).json({ token });
      } else {
        res.status(400).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "user does not exist" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not login" });
  }
};

const getStudentInfo = async (req: Request, res: Response) => {
  try {
    const studentInfo = req.cookies["userInfo"];
    if (studentInfo) {
      const decodedToken = Jwt.verify(studentInfo, process.env.JWT_SECRET);
      res.status(200).json({ message: "Student found", data: decodedToken });
      console.log(decodedToken);
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get student" });
  }
};

const getPendingAssignments = async (req: Request, res: Response) => {
  try {
    const studentInfo = req.cookies["userInfo"];
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      const pendingAssignments = student?.pending_assignment;
      console.log(pendingAssignments);
      res.status(200).json({
        message: "Pending assignments found",
        data: pendingAssignments,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get pending assignments" });
  }
};

const getSubmittedAssignments = async (req: Request, res: Response) => {
  try {
    const studentInfo = req.cookies["userInfo"];
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      const submittedAssignments = student?.submitted_assignment;
      console.log(submittedAssignments);
      res.status(200).json({
        message: "Submitted assignments found",
        data: submittedAssignments,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get submitted assignments" });
  }
};

const getCompletedAssignments = async (req: Request, res: Response) => {
  try {
    const studentInfo = req.cookies["userInfo"];
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      const completedAssignments = student?.completed_assignment;
      console.log(completedAssignments);
      res.status(200).json({
        message: "Completed assignments found",
        data: completedAssignments,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get completed assignments" });
  }
};

const getRedoAssignments = async (req: Request, res: Response) => {
  try {
    const studentInfo = req.cookies["userInfo"];
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      const redoAssignments = student?.redo_assignment;
      console.log(redoAssignments);
      res.status(200).json({
        message: "Redo assignments found",
        data: redoAssignments,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get redo assignments" });
  }
};

const updateAssignmnet = async (req: Request, res: Response) => {
  try {
    const _id = new ObjectId();
    const { assignment_name, description, due_date, teacher_id } =
      req.body.assignment;
    const assignment: studentAssignment = {
      _id,
      assignment_name,
      description,
      assigned_date: new Date(),
      due_date,
      teacher_id,
    };
    const studentInfo = req.cookies["userInfo"];
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOneAndUpdate(
        { _id: new ObjectId(decodedToken.id) },
        {
          $addToSet: {
            pending_assignment: { ...assignment },
          },
        },
        { returnDocument: "after" }
      );
      console.log(student);
      res.status(200).json({
        message: "added",
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get pending assignments" });
  }
};

const submitAssignment = async (req: Request, res: Response) => {
  try {
    const { assignment_id, data } = req.body;
    console.log("assignment_id : ", assignment_id);
    console.log("file", req.files.file);
    const studentInfo = req.cookies["userInfo"];
    console.log("studentInfo : ", studentInfo);
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      if (student) {
        const deletedAssignment = student.pending_assignment.find(
          (assignment) => {
            return assignment._id.toString() === assignment_id.toString();
          }
        );

        // Check if a file was uploaded
        if (!req.files || !req.files.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.file; // Access the first element of the UploadedFile array

        // Create a readable stream from the file buffer
        const fileStream = new Readable();
        if (Array.isArray(file)) {
          // Handle multiple files
          file.forEach((singleFile) => {
            fileStream.push(singleFile.data);
          });
        } else {
          // Handle a single file
          fileStream.push(file.data);
        }
        fileStream.push(null);

        console.log("fileStream : ", fileStream);

        const uploadStream: GridFSBucketWriteStream =
          gridfsBucket.openUploadStream(
            Array.isArray(req.files.file)
              ? req.files.file[0].name.toString()
              : req.files.file.name.toString()
          );

        fileStream.pipe(uploadStream);
        uploadStream.on("error", function (error) {
          console.error("Error uploading file: ", error);
          res.status(500).send("Error uploading file");
        });

        uploadStream.on("finish", async () => {
          const fileId = uploadStream.id;
          const updatedStudent = await collection.students?.findOneAndUpdate(
            { _id: new ObjectId(decodedToken.id) },
            {
              $pull: {
                pending_assignment: {
                  _id: new ObjectId(assignment_id),
                },
              },
            },
            { returnDocument: "after" }
          );

          const submittedAssignment =
            await collection.students?.findOneAndUpdate(
              { _id: new ObjectId(decodedToken.id) },
              {
                $addToSet: {
                  submitted_assignment: {
                    ...deletedAssignment,
                    data,
                    file_id: fileId, // Use the stored file ID
                    submission_date: new Date(),
                  },
                },
              },
              { returnDocument: "after" }
            );

          const teacherId = deletedAssignment.teacher_id;
          const teacher = await collection.teachers?.findOneAndUpdate(
            {
              _id: new ObjectId(teacherId),
              "assignments._id": new ObjectId(assignment_id),
            },
            {
              $addToSet: {
                "assignments.$.responses": {
                  student_id: decodedToken.id,
                  data,
                  file_id: fileId, // Use the stored file ID
                  submission_date: new Date(),
                },
              },
            },
            { returnDocument: "after" }
          );

          return res.status(200).json({
            message: "Assignment deleted successfully and added to submitted",
            deletedAssignment,
          });
        });
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } else {
      res.status(404).json({ message: "Please log in" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not submit assignment" });
  }
};

const submitRedoAssignment = async (req: Request, res: Response) => {
  try {
    const { assignment_id, data } = req.body;
    console.log("assignment_id : ", assignment_id);
    console.log("file", req.files.file);
    const studentInfo = req.cookies["userInfo"];
    console.log("studentInfo : ", studentInfo);
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      if (student) {
        const deletedAssignment = student.redo_assignment.find((assignment) => {
          return assignment._id.toString() === assignment_id.toString();
        });

        // Check if a file was uploaded
        if (!req.files || !req.files.file) {
          return res.status(400).json({ message: "No file uploaded" });
        }

        const file = req.files.file; // Access the first element of the UploadedFile array

        // Create a readable stream from the file buffer
        const fileStream = new Readable();
        if (Array.isArray(file)) {
          // Handle multiple files
          file.forEach((singleFile) => {
            fileStream.push(singleFile.data);
          });
        } else {
          // Handle a single file
          fileStream.push(file.data);
        }
        fileStream.push(null);

        console.log("fileStream : ", fileStream);

        const uploadStream: GridFSBucketWriteStream =
          gridfsBucket.openUploadStream(
            Array.isArray(req.files.file)
              ? req.files.file[0].name.toString()
              : req.files.file.name.toString()
          );

        fileStream.pipe(uploadStream);
        uploadStream.on("error", function (error) {
          console.error("Error uploading file: ", error);
          res.status(500).send("Error uploading file");
        });

        uploadStream.on("finish", async () => {
          const fileId = uploadStream.id;
          const updatedStudent = await collection.students?.findOneAndUpdate(
            { _id: new ObjectId(decodedToken.id) },
            {
              $pull: {
                redo_assignment: {
                  _id: new ObjectId(assignment_id),
                },
              },
            },
            { returnDocument: "after" }
          );

          const submittedAssignment =
            await collection.students?.findOneAndUpdate(
              { _id: new ObjectId(decodedToken.id) },
              {
                $addToSet: {
                  submitted_assignment: {
                    ...deletedAssignment,
                    data,
                    file_id: fileId, // Use the stored file ID
                    submission_date: new Date(),
                  },
                },
              },
              { returnDocument: "after" }
            );

          const teacherId = deletedAssignment.teacher_id;
          const teacher = await collection.teachers?.findOneAndUpdate(
            {
              _id: new ObjectId(teacherId),
              "assignments._id": new ObjectId(assignment_id),
            },
            {
              $addToSet: {
                "assignments.$.responses": {
                  student_id: decodedToken.id,
                  data,
                  file_id: fileId, // Use the stored file ID
                  submission_date: new Date(),
                },
              },
            },
            { returnDocument: "after" }
          );

          return res.status(200).json({
            message: "Assignment deleted successfully and added to submitted",
            deletedAssignment,
          });
        });
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } else {
      res.status(404).json({ message: "Please log in" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Could not submit assignment" });
  }
};

export {
  signupStudent,
  loginStudent,
  getStudentInfo,
  getPendingAssignments,
  getSubmittedAssignments,
  getCompletedAssignments,
  getRedoAssignments,
  updateAssignmnet,
  submitAssignment,
  submitRedoAssignment,
};
