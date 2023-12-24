import {
  studentAssignment,
  submittedAssignment,
  correctedAssignment,
  redoAssignment,
} from "./assignment";

export interface student {
  name: string;
  email: string;
  class: string;
  roll_no: string;
  number: number;
  password: string;
  pending_assignment: studentAssignment[];
  completed_assignment: correctedAssignment[];
  submitted_assignment: submittedAssignment[];
  redo_assignment: redoAssignment[];
}
