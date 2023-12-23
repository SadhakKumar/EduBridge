type correction = {
  assignment_id: string;
  assignment_name: string;
  description: string;
  due_date: string;
  submission_date: Date;
  roll_no: string;
  student_name: string;
};
type corrected = {
  assignment_id: string;
  assignment_name: string;
  description: string;
  due_date: string;
  submission_date: Date;
  roll_no: string;
  student_name: string;
  marks: number;
};

export interface teacher {
  name: string;
  email: string;
  password: string;
  number: number;
  correction: correction[];
  corrected: corrected[];
}
