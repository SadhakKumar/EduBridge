import {useState} from 'react'
import './redoassignment.scss'
import { useDispatch } from 'react-redux';
import axios from '../../api/axios';
import { fetchAsyncRedo,fetchAsyncSubmitted } from '../../features/student/studentSlice';

const RedoAssignment = (props) => {
    const {item} = props;
    const dispatch = useDispatch();
    const [submission, setSubmission] = useState('');
    const [isSubmissionDisabled, setIsSubmissionDisabled] = useState(true);

    const handleSubmissionChange = (event) => {
        setSubmission(event.target.value);
        setIsSubmissionDisabled(false);
    };

    const handleSubmissionSubmit = () => {
    
      const response = axios.post('/student/submitredoassignment',
      JSON.stringify({assignment_id : item._id,data : submission}),
      {
        headers: {'content-type': 'application/json'},
        withCredentials: true
      });
      if(response){
        console.log(response);
        alert('Assignment submitted successfully');
        dispatch(fetchAsyncRedo());
        dispatch(fetchAsyncSubmitted());
      }
      console.log('Assignment submitted:', submission);
      
    };
    return (
        <div className="assignment-container">
          <div className="assignment-details">
            <h2>{item.assignment_name}</h2>
            <p className="description">Description: {item.description}</p>
            <p>Teacher ID: {item.teacher_id}</p>
            <p>Assigned Date: {item.assigned_date}</p>
            <p>Due Date: {item.due_date}</p>
            <h3>Remark: {item.remark}</h3>
          </div>
    
          <div className="submission-container">
            <label htmlFor="submission">Your Submission:</label>
            <textarea
              id="submission"
              name="submission"
              value={submission}
              onChange={handleSubmissionChange}
            ></textarea>
            <button className="submit-button" onClick={handleSubmissionSubmit} disabled = {isSubmissionDisabled}>
              Submit
            </button>
          </div>
        </div>
      );
}

export default RedoAssignment