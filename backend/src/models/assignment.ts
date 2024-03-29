import { ObjectId } from "mongodb";

export type studentAssignment = {
  _id: ObjectId;
  assignment_name: string;
  description: string;
  assigned_date: Date;
  teacher_id: string;
  due_date: Date;
};

export type submittedAssignment = {
  _id: ObjectId;
  assignment_name: string;
  description: string;
  teacher_id: string;
  assigned_date: Date;
  due_date: Date;
  data: string;
  file_id?: ObjectId;
  submission_date: Date;
};

export type correctedAssignment = {
  _id: ObjectId;
  assignment_name: string;
  description: string;
  teacher_id: string;
  due_date: string;
  data: string;
  file_id?: ObjectId;
  submission_date: Date;
  correction_date: Date;
  marks: number;
  remark: string;
};

export type redoAssignment = {
  _id: ObjectId;
  assignment_name: string;
  description: string;
  teacher_id: string;
  assigned_date: Date;
  due_date: Date;
  submission_date: Date;
  remark: string;
};
