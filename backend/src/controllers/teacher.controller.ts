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

        const student = await collection.students?.updateMany(
          {
            class: newAssignment.class,
            roll_no: {
              $gte: String(newAssignment.starting_roll_no),
              $lte: String(newAssignment.ending_roll_no),
            },
          },
          {
            $addToSet: {
              pending_assignment: studentAssignment,
            },
          }
        );

        if (student) {
          console.log(student);
          return res
            .status(201)
            .json({ message: "Assignment created successfully student" });
        } else {
          // If student update fails
          throw new Error("Could not update students");
        }
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

export default createAssignment;

export { signupTeacher, loginTeacher, createAssignment };
