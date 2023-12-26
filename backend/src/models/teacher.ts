import { ObjectId } from "mongodb";

export type assignment = {
  _id: ObjectId;
  assignment_name: string;
  description: string;
  assigned_date: Date;
  due_date: Date;
  class: string;
  starting_roll_no: string;
  ending_roll_no: string;
  responses: responses[];
  correted: corrected[];
};

export type responses = {
  student_id: ObjectId;
  data: string;
  submitted_date: Date;
};
export type corrected = {
  student_id: ObjectId;
  data: string;
  marks: number;
  remark: string;
  correction_date: Date;
};

export interface teacher {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  number: number;
  assignments: assignment[];
}
