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
          { email: user.email, id: user._id },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );
        res.cookie("userInfo", token, { httpOnly: true });
        res.status(200).json({ message: "Logged in successfully" });
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
export {
  signupStudent,
  loginStudent,
  getStudentInfo,
  getPendingAssignments,
  updateAssignmnet,
};
