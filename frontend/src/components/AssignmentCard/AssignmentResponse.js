import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import { fetchAssignmentResponse , fetchCorrectedAssignments} from '../../features/teacher/teacherSlice';
import './assignmentresponse.scss';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';
import DisplayPDF from '../DisplayPdf/DisplayPdf';

const AssignmentResponse = (props) => {
  const { item } = props;
  const {id} = useParams();
  const dispatch = useDispatch();
  const [grades, setGrades] = useState('');
  const [remark, setRemark] = useState('');

  const handleGradeChange = (e) => {
    setGrades(e.target.value);
  };

  const handleRemarkChange = (e) => {
    setRemark(e.target.value);
  };

  const isCheckButtonEnabled = grades !== '';
  const isRedoButtonEnabled = remark !== '';

  const handleCheck = async() => {
    
    const response = await axios.post('/teacher/checkAssignment', 
    JSON.stringify({
      assignment_id: id,
      student_id: item.student_id,
      marks: grades,
      review: remark
    }),
    {
      headers: {'content-type': 'application/json'},
        withCredentials: true
    });
    if(response){
      dispatch(fetchAssignmentResponse(id));
    }
    console.log(response.data);
    
  };

  const handleRedo = () => {
    const response = axios.post('/teacher/checkAssignmentForReDo',
    JSON.stringify({
      assignment_id: id,
      student_id: item.student_id,
      review: remark
    }),
    {
      headers: {'content-type': 'application/json'},
        withCredentials: true
    });
    if(response){
      dispatch(fetchAssignmentResponse(id));
      dispatch(fetchCorrectedAssignments(id));
  
    }
  };

  return (
    <div className="assignment-response-container">
      <div className="response-details">
        <p>Student ID: {item.student_id}</p>
        <p>Data: {item.data}</p>
        {item.file_id ? (
          <DisplayPDF fileId={item.file_id} />
        ) : <p>No file submitted</p>}
        <p>Submitted Date: {item.submission_date}</p>
      </div>
      <div className="grade-input">
        <label htmlFor="grades">Grades/Marks:</label>
        <input
          type="text"
          id="grades"
          value={grades}
          onChange={handleGradeChange}
          placeholder="Enter grades/marks"
        />
      </div>
      <div className="remark-input">
        <label htmlFor="remark">Remark:</label>
        <input
          type="text"
          id="remark"
          value={remark}
          onChange={handleRemarkChange}
          placeholder="Enter remark"
        />
      </div>
      <div className="action-buttons">
        <button
          onClick={handleCheck}
          disabled={!isCheckButtonEnabled}
        >
          Check
        </button>
        <button
          onClick={handleRedo}
          disabled={!isRedoButtonEnabled}
        >
          Redo Assignment
        </button>
      </div>
    </div>
  );
};

export default AssignmentResponse;
