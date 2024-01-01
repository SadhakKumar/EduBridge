import {useState} from 'react'
import './createassignment.scss'
import axios from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const CreateAssignment = () => {
    const navigate = useNavigate();
    const [assignmentName, setAssignmentName] = useState('');
    const [description, setDescription] = useState('');
    const [assignedDate, setAssignedDate] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [classValue, setClassValue] = useState('');
    const [startingRollNo, setStartingRollNo] = useState('');
    const [endingRollNo, setEndingRollNo] = useState('');

    const handleCreateAssignment = async () => {
        const response = await axios.post('/teacher/createAssignment',
         JSON.stringify({
            assignment_name : assignmentName,
            description : description,
            assigned_date : assignedDate,
            due_date : dueDate,
            class : classValue,
            starting_roll_no : startingRollNo,
            ending_roll_no : endingRollNo,
            responses: [],
            correted : []
          }),{
            headers: {'content-type': 'application/json'},
            withCredentials: true
         })
         console.log(response.data);
         navigate('/dashboard');
      };
    

    return (
        <div className="create-assignment-container">
          <h2>Create New Assignment</h2>
          <form>
            <div className="form-group">
              <label htmlFor="assignmentName">Assignment Name:</label>
              <input
                type="text"
                id="assignmentName"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="assignedDate">Assigned Date:</label>
              <input
                type="date"
                id="assignedDate"
                value={assignedDate}
                onChange={(e) => setAssignedDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="dueDate">Due Date:</label>
              <input
                type="date"
                id="dueDate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="classValue">Class:</label>
              <input
                type="text"
                id="classValue"
                value={classValue}
                onChange={(e) => setClassValue(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="startingRollNo">Starting Roll No:</label>
              <input
                type="text"
                id="startingRollNo"
                value={startingRollNo}
                onChange={(e) => setStartingRollNo(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="endingRollNo">Ending Roll No:</label>
              <input
                type="text"
                id="endingRollNo"
                value={endingRollNo}
                onChange={(e) => setEndingRollNo(e.target.value)}
              />
            </div>
            <button type="button" onClick={handleCreateAssignment}>
              Create Assignment
            </button>
          </form>
        </div>
      );
}

export default CreateAssignment