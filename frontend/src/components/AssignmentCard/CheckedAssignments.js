import React from 'react'
import './checkedassignment.scss'
import DisplayPDF from '../DisplayPdf/DisplayPdf';
const CheckedAssignments = (props) => {
    const {item} = props;
    return (
        <div className="checked-assignment-container">
          <h2>{item.assignment_name}</h2>
          <div className="assignment-details">
            <p className="description">{item.description}</p>
            <p>Teacher ID: {item.teacher_id}</p>
            <p>Due Date: {item.due_date}</p>
            <p>Submission Date: {item.submission_date}</p>
            <p>Correction Date: {item.correction_date}</p>
          </div>
          <div className="correction-details">
            <p>Data: {item.data}</p>
            {item.file_id ? (
              <DisplayPDF fileId={item.file_id} /> )
            : <p>No file uploaded</p> }
            <p>Marks: {item.marks}</p>
            <p>Remark: {item.remark}</p>
          </div>
        </div>
      );
}

export default CheckedAssignments