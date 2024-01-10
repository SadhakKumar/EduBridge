import {useState} from 'react'
import './redoassignment.scss'
import { useDispatch } from 'react-redux';
import axios from '../../api/axios';
import { fetchAsyncRedo,fetchAsyncSubmitted } from '../../features/student/studentSlice';

const RedoAssignment = (props) => {
    const {item} = props;
    const dispatch = useDispatch();
    const [submission, setSubmission] = useState('');
    const [file, setFile] = useState(null);
    const [isSubmissionDisabled, setIsSubmissionDisabled] = useState(true);

    const handleSubmissionChange = (event) => {
        setSubmission(event.target.value);
        setIsSubmissionDisabled(false);
    };

    const handleFileChange = (event) => {
      const selectedFile = event.target.files[0];
      setIsSubmissionDisabled(false);
      setFile(selectedFile);
    };

    const handleSubmissionSubmit = async() => {
    
      try {
        console.log("assignment_id", item._id);
        const formData = new FormData();
        formData.append('assignment_id', item._id);
        formData.append('data', submission);
        formData.append('file', file);
  
        console.log(Object.fromEntries(formData.entries()))
  
        const response = await axios.post('/student/submitredoassignment', formData, {
          headers: {
                'Content-Type': 'multipart/form-data',
              },
              withCredentials: true,
        });
        if (response) {
          console.log(response);
          alert('Assignment submitted successfully');
          dispatch(fetchAsyncRedo());
          dispatch(fetchAsyncSubmitted());
        }
        console.log('Assignment submitted:', submission);
      } catch (error) {
        console.error('Error submitting assignment:', error.message);
      }
      
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

            <label htmlFor="file">Select a File:</label>
            <input type="file" id="file" name="file" accept=".pdf" onChange={handleFileChange} />

            <button className="submit-button" onClick={handleSubmissionSubmit} disabled = {file ? false : true}>
              Submit
            </button>
          </div>
        </div>
      );
}

export default RedoAssignment