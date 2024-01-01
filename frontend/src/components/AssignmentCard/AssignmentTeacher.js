import React from 'react'
import './assignmentteacher.scss'
import { useNavigate } from 'react-router-dom';

const AssignmentTeacher = (props) => {
    const {item} = props;
    const navigate = useNavigate();

    const onDetailsClick = (id) => {
      navigate(`/dashboard/${id}`);
        console.log(id);
    }
    return (
        <div className="teacher-assignment-container">
          <div className="assignment-details">
            <h2>{item.assignment_name}</h2>
            <p>Description: {item.description}</p>
            <p>Assigned Date: {item.assigned_date}</p>
            <p>Due Date: {item.due_date}</p>
            <p>Class: {item.class}</p>
            <p>Starting Roll No: {item.starting_roll_no}</p>
            <p>Ending Roll No: {item.ending_roll_no}</p>
          </div>
          <button onClick={() => onDetailsClick(item._id)}>View Details</button>
        </div>
      );
    
}

export default AssignmentTeacher