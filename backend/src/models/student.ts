export interface pendingAssignment {
  assignment_id: string;
  assignment_name: string;
  description: string;
  teacher_id: string;
  due_date: string;
}
type completedAssignment = {
  assignment_id: string;
  assignment_name: string;
  description: string;
  teacher_id: string;
  due_date: string;
  marks: number;
};
type submittedAssignment = {
  assignment_id: string;
  assignment_name: string;
  description: string;
  teacher_id: string;
  due_date: string;
  submission_date: Date;
};
type redoAssignment = {
  assignment_id: string;
  assignment_name: string;
  description: string;
  teacher_id: string;
  due_date: string;
  submission_date: Date;
  marks: number;
  remark: string;
};

export interface student {
  name: string;
  email: string;
  class: string;
  roll_no: string;
  number: number;
  password: string;
  pending_assignment: pendingAssignment[];
  completed_assignment: completedAssignment[];
  submitted_assignment: submittedAssignment[];
  redo_assignment: redoAssignment[];
}
