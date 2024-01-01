import React from 'react'
import './assignmentcorrected.scss';

const AssignmentCorrected = (props) => {
    const {item} = props;
    return (
        <div className="corrected-assignment-details-container">
          <h2>Corrected Assignment Details</h2>
          <div className="details">
            <p><strong>Student ID:</strong> {item.student_id}</p>
            <p><strong>Data:</strong> {item.data}</p>
            <p><strong>Marks:</strong> {item.marks}</p>
            <p><strong>Remark:</strong> {item.remark}</p>
            <p><strong>Correction Date:</strong> {item.correction_date}</p>
          </div>
        </div>
      );
}

export default AssignmentCorrected