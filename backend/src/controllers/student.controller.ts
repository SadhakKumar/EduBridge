import { Request, Response } from "express";
import { student } from "../models/student";
import { studentAssignment } from "../models/assignment";
import { collection } from "../service/database.service";
import Jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import { ObjectId } from "mongodb";

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
    const studentInfo = req.cookies["userInfo"];
    if (studentInfo) {
      const decodedToken = await Jwt.verify(
        studentInfo,
        process.env.JWT_SECRET
      );
      const student = await collection.students?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      console.log("student : ", student);
      if (student) {
        const deletedAssignment = student.pending_assignment.find(
          (assignment) => {
            return assignment._id.toString() === assignment_id.toString();
          }
        );
        console.log("deletedAssignment : ", deletedAssignment);
        const updatedStudent = await collection.students?.findOneAndUpdate(
          { _id: new ObjectId(decodedToken.id) },
          {
            $pull: {
              pending_assignment: { _id: new ObjectId(assignment_id) },
            },
          },
          { returnDocument: "after" }
        );
        const submittedAssignment = await collection.students?.findOneAndUpdate(
          { _id: new ObjectId(decodedToken.id) },
          {
            $addToSet: {
              submitted_assignment: {
                ...deletedAssignment,
                data,
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
                data: data,
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
      } else {
        res.status(404).json({ message: "Assignment not found" });
      }
    } else {
      res.status(404).json({ message: "pls log in" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not submit assignment" });
  }
};

// const submitRedoAssignment = async (req: Request, res: Response) => {
//   try {
//     const { assignment_id, data } = req.body;
//     const studentInfo = req.cookies["userInfo"];
//     if (studentInfo) {
//       const decodedToken = await Jwt.verify(
//         studentInfo,
//         process.env.JWT_SECRET
//       );
//       const student = await collection.students?.findOne({
//         _id: new ObjectId(decodedToken.id),
//       });
//       console.log("student : ", student);
//       if (student) {
//         const deletedAssignment = student.redo_assignment.find((assignment) => {
//           return assignment._id.toString() === assignment_id.toString();
//         });
//         console.log("deletedAssignment : ", deletedAssignment);
//         const updatedStudent = await collection.students?.findOneAndUpdate(
//           { _id: new ObjectId(decodedToken.id) },
//           {
//             $pull: {
//               redo_assignment: { _id: new ObjectId(assignment_id) },
//             },
//           },
//           { returnDocument: "after" }
//         );
//         const submittedAssignment = await collection.students?.findOneAndUpdate(
//           { _id: new ObjectId(decodedToken.id) },
//           {
//             $addToSet: {
//               submitted_assignment: {
//                 _id: new ObjectId(assignment_id),
//                 assignment_name: deletedAssignment.assignment_name,
//                 description: deletedAssignment.description,
//                 teacher_id: deletedAssignment.teacher_id,
//                 assigned_date: deletedAssignment.assigned_date,
//                 due_date: deletedAssignment.due_date,
//                 data,
//                 submission_date: new Date(),
//               },
//             },
//           },
//           { returnDocument: "after" }
//         );
//         const teacherId = deletedAssignment.teacher_id;
//         const teacher = await collection.teachers?.findOneAndUpdate(
//           {
//             _id: new ObjectId(teacherId),
//             "assignments._id": new ObjectId(assignment_id),
//           },
//           {
//             $addToSet: {
//               "assignments.$.responses": {
//                 student_id: decodedToken.id,
//                 data: data,
//                 submission_date: new Date(),
//               },
//             },
//           },
//           { returnDocument: "after" }
//         );
//         return res.status(200).json({
//           message: "Assignment deleted successfully and added to submitted",
//           deletedAssignment,
//         });
//       } else {
//         res.status(404).json({ message: "Assignment not found" });
//       }
//     } else {
//       res.status(404).json({ message: "pls log in" });
//     }
//   } catch (error) {
//     res.status(500).json({ message: "Could not submit assignment" });
//   }
// }

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
};
