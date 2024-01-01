import { Request, Response } from "express";
import { teacher } from "../models/teacher";
import { student } from "../models/student";
import { assignment } from "../models/teacher";
import { studentAssignment } from "../models/assignment";
import { collection } from "../service/database.service";
import Jwt from "jsonwebtoken";
import bycrypt from "bcrypt";
import { ObjectId } from "mongodb";

// ==== Function starts here ==== //

const signupTeacher = async (req: Request, res: Response) => {
  try {
    const newTeacher: teacher = req.body;
    const findIfTeacherExists = await collection.teachers?.findOne({
      email: newTeacher.email,
    });
    if (findIfTeacherExists) {
      return res.status(400).json({ message: "Teacher already exists" });
    }
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(newTeacher.password, salt);
    newTeacher.password = hashedPassword;
    const result = await collection.teachers?.insertOne(newTeacher);
    if (result?.acknowledged) {
      res.status(201).json({ message: "Teacher created successfully" });
    } else {
      res.status(500).json({ message: "Could not create teacher" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not create teacher" });
  }
};

const loginTeacher = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: "Please enter email and password" });
    }
    const user = await collection.teachers?.findOne({ email });

    if (user) {
      const isPasswordCorrect = await bycrypt.compare(password, user.password);
      if (isPasswordCorrect) {
        const token = Jwt.sign(
          { email: user.email, id: user._id, role: "teacher" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("userInfo", token);
        res.status(200).json({ token });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not login" });
  }
};

const createAssignment = async (req: Request, res: Response) => {
  try {
    const newAssignment: assignment = req.body;

    const _id = new ObjectId();
    const teacherInfo = await req.cookies["userInfo"];
    if (teacherInfo) {
      const decodedToken = await Jwt.verify(
        teacherInfo,
        process.env.JWT_SECRET
      );

      const teacher = await collection.teachers?.findOneAndUpdate(
        { _id: new ObjectId(decodedToken.id) },
        {
          $push: {
            assignments: { _id: _id, ...newAssignment },
          },
        },
        { returnDocument: "after" }
      );

      if (teacher) {
        const studentAssignment: studentAssignment = {
          _id: _id,
          assignment_name: newAssignment.assignment_name,
          description: newAssignment.description,
          teacher_id: decodedToken.id,
          assigned_date: new Date(),
          due_date: newAssignment.due_date,
        };

        const filter = {
          class: newAssignment.class,
          roll_no: {
            $gte: newAssignment.starting_roll_no,
            $lte: newAssignment.ending_roll_no,
          },
        };

        const studentsToUpdate = await collection.students
          ?.find(filter)
          .toArray();

        for (const student of studentsToUpdate) {
          const updatedStudent = await collection.students?.findOneAndUpdate(
            { _id: student._id },
            {
              $addToSet: {
                pending_assignment: studentAssignment,
              },
            },
            { returnDocument: "after" }
          );

          console.log("Updated student:", updatedStudent);
        }
        res.json({ message: "Assignment created successfully" });
      } else {
        // If teacher update fails
        throw new Error("Could not update teacher");
      }
    } else {
      // If teacherInfo is missing
      return res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Could not create assignment" });
  }
};

const checkAssignment = async (req: Request, res: Response) => {
  try {
    const { assignment_id, student_id, marks, review } = req.body;
    const teacherInfo = await req.cookies["userInfo"];
    if (teacherInfo) {
      const decodedToken = await Jwt.verify(
        teacherInfo,
        process.env.JWT_SECRET
      );
      const teacherBeforeUpdate = await collection.teachers?.findOne({
        _id: new ObjectId(decodedToken.id),
        "assignments._id": new ObjectId(assignment_id),
      });
      console.log("teacherBeforeUpdate : ", teacherBeforeUpdate);
      let pulledResponse;
      let matchedAssignment;
      if (teacherBeforeUpdate) {
        matchedAssignment = teacherBeforeUpdate.assignments.find(
          (assignment) => {
            return assignment._id.toString() === assignment_id.toString();
          }
        );
        console.log("matchedAssignment : ", matchedAssignment);
        if (matchedAssignment) {
          pulledResponse = matchedAssignment.responses.find((response) => {
            return response.student_id.toString() === student_id.toString();
          });
        }
      }
      console.log("pulledResponse : ", pulledResponse);

      const teacher = await collection.teachers?.findOneAndUpdate(
        {
          _id: new ObjectId(decodedToken.id),
          "assignments._id": new ObjectId(assignment_id),
          "assignments.responses.student_id": student_id,
        },
        {
          $pull: {
            "assignments.$.responses": { student_id: student_id },
          },
        },
        { returnDocument: "after" }
      );
      const addToCorrected = await collection.teachers?.findOneAndUpdate(
        {
          _id: new ObjectId(decodedToken.id),
          "assignments._id": new ObjectId(assignment_id),
        },
        {
          $addToSet: {
            "assignments.$.correted": {
              student_id: student_id,
              data: pulledResponse.data,
              marks: marks,
              remark: review,
              correction_date: new Date(),
            },
          },
        },
        { returnDocument: "after" }
      );
      const addToCompletedAssignment =
        await collection.students?.findOneAndUpdate(
          {
            _id: new ObjectId(student_id),
          },
          {
            $addToSet: {
              completed_assignment: {
                _id: matchedAssignment._id,
                assignment_name: matchedAssignment.assignment_name,
                description: matchedAssignment.description,
                teacher_id: decodedToken.id,
                due_date: matchedAssignment.due_date,
                data: pulledResponse.data,
                submission_date: pulledResponse.submission_date,
                correction_date: new Date(),
                marks: marks,
                remark: review,
              },
            },
          },
          { returnDocument: "after" }
        );
      const pullFromSubmittedAssignment =
        await collection.students.findOneAndUpdate(
          {
            _id: new ObjectId(student_id),
          },
          {
            $pull: {
              submitted_assignment: { _id: matchedAssignment._id },
            },
          },
          { returnDocument: "after" }
        );
      console.log("teacher : ", teacher);
      res.json({ message: "Assignment checked successfully" });
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not check assignment" });
  }
};

const checkAssignmentForReDo = async (req: Request, res: Response) => {
  try {
    const { assignment_id, student_id, review } = req.body;
    const teacherInfo = await req.cookies["userInfo"];
    if (teacherInfo) {
      const decodedToken = await Jwt.verify(
        teacherInfo,
        process.env.JWT_SECRET
      );
      const teacherBeforeUpdate = await collection.teachers?.findOne({
        _id: new ObjectId(decodedToken.id),
        "assignments._id": new ObjectId(assignment_id),
      });
      console.log("teacherBeforeUpdate : ", teacherBeforeUpdate);
      let pulledResponse;
      let matchedAssignment;
      if (teacherBeforeUpdate) {
        matchedAssignment = teacherBeforeUpdate.assignments.find(
          (assignment) => {
            return assignment._id.toString() === assignment_id.toString();
          }
        );
        console.log("matchedAssignment : ", matchedAssignment);
        if (matchedAssignment) {
          pulledResponse = matchedAssignment.responses.find((response) => {
            return response.student_id.toString() === student_id.toString();
          });
        }
      }
      console.log("pulledResponse : ", pulledResponse);

      const teacher = await collection.teachers?.findOneAndUpdate(
        {
          _id: new ObjectId(decodedToken.id),
          "assignments._id": new ObjectId(assignment_id),
          "assignments.responses.student_id": student_id,
        },
        {
          $pull: {
            "assignments.$.responses": { student_id: student_id },
          },
        },
        { returnDocument: "after" }
      );

      const addToReDOAssignment = await collection.students?.findOneAndUpdate(
        {
          _id: new ObjectId(student_id),
        },
        {
          $addToSet: {
            redo_assignment: {
              _id: matchedAssignment._id,
              assignment_name: matchedAssignment.assignment_name,
              description: matchedAssignment.description,
              teacher_id: decodedToken.id,
              assigned_date: matchedAssignment.assigned_date,
              due_date: matchedAssignment.due_date,
              submission_date: pulledResponse.submission_date,
              remark: review,
            },
          },
        },
        { returnDocument: "after" }
      );

      const pullFromSubmittedAssignment =
        await collection.students.findOneAndUpdate(
          {
            _id: new ObjectId(student_id),
          },
          {
            $pull: {
              submitted_assignment: { _id: matchedAssignment._id },
            },
          },
          { returnDocument: "after" }
        );
      res.status(200).json({ message: "Assignment checked successfully" });
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {}
};

const getAllAssignment = async (req: Request, res: Response) => {
  try {
    const teacherInfo = await req.cookies["userInfo"];
    if (teacherInfo) {
      const decodedToken = await Jwt.verify(
        teacherInfo,
        process.env.JWT_SECRET
      );
      const teacher = await collection.teachers?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      if (teacher) {
        const assignments = teacher.assignments;
        res.status(200).json({ assignments });
      } else {
        res.status(401).json({ message: "could not get assignments" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get all assignment" });
  }
};

const getAllResponses = async (req: Request, res: Response) => {
  try {
    const { assignment_id } = req.body;
    const teacherInfo = await req.cookies["userInfo"];
    if (teacherInfo) {
      const decodedToken = await Jwt.verify(
        teacherInfo,
        process.env.JWT_SECRET
      );
      const teacher = await collection.teachers?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      if (teacher) {
        const assignment = teacher.assignments.find((assignment) => {
          return assignment._id.toString() === assignment_id.toString();
        });
        const responses = assignment.responses;
        res.status(200).json({ responses });
      } else {
        res.status(401).json({ message: "could not get assignments" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get all responses" });
  }
};

const getAllCorrected = async (req: Request, res: Response) => {
  try {
    const { assignment_id } = req.body;
    const teacherInfo = await req.cookies["userInfo"];
    if (teacherInfo) {
      const decodedToken = await Jwt.verify(
        teacherInfo,
        process.env.JWT_SECRET
      );
      const teacher = await collection.teachers?.findOne({
        _id: new ObjectId(decodedToken.id),
      });
      if (teacher) {
        const assignment = teacher.assignments.find((assignment) => {
          return assignment._id.toString() === assignment_id.toString();
        });
        const corrections = assignment.correted;
        res.status(200).json({ corrections });
      } else {
        res.status(401).json({ message: "could not get assignments" });
      }
    } else {
      res.status(401).json({ message: "Unauthorized access" });
    }
  } catch (error) {
    res.status(500).json({ message: "Could not get all corrections" });
  }
};

export {
  signupTeacher,
  loginTeacher,
  createAssignment,
  checkAssignment,
  checkAssignmentForReDo,
  getAllAssignment,
  getAllResponses,
  getAllCorrected,
};
