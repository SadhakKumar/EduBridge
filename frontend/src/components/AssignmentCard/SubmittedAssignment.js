import React from 'react'
import './submittedassignment.scss'

const SubmittedAssignment = (props) => {
    const {item} = props;
    return (
        <div className="submitted-assignment-container">
          <h2>{item.assignment_name}</h2>
          <div className="assignment-details">
            <p className="description">{item.description}</p>
            <p>Teacher ID: {item.teacher_id}</p>
            <p>Assigned Date: {item.assigned_date}</p>
            <p>Due Date: {item.due_date}</p>
            <p>Your Submission: {item.data}</p>
          </div>
          <div className="submission-details">
            <p>Submission Data: {item.submission_date}</p>
          </div>
        </div>
      );
}

export default SubmittedAssignment