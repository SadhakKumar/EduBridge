import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import './signup.scss';

const Signup = () => {
    const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');
  const [studentDetails, setStudentDetails] = useState({
    name: '',
    email: '',
    number: '',
    class: '',
    roll_no: '',
    password: '',
  });
  const [teacherDetails, setTeacherDetails] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
  });

  const handleRoleChange = (role) => {
    setSelectedRole(role);
  };

  const handleInputChange = (event) => {
    const { id, value } = event.target;
    if (selectedRole === 'student') {
      setStudentDetails((prevDetails) => ({
        ...prevDetails,
        [id]: value,
      }));
    } else {
      setTeacherDetails((prevDetails) => ({
        ...prevDetails,
        [id]: value,
      }));
    }
  };

  const handleSubmit = async(event) => {
    event.preventDefault();
    if(selectedRole === 'student') {
      const response = await axios.post('/student/signupstudent',
      JSON.stringify({
        name: studentDetails.name,
        email: studentDetails.email,
        class: studentDetails.class,
        roll_no: studentDetails.roll_no,
        number: studentDetails.number,
        password: studentDetails.password,
        pending_assignment: [],
        completed_assignment:[],
        submitted_assignment: [],
        redo_assignment : []
      }),
      {
        headers: {'content-type': 'application/json'},
        withCredentials: true
      });
      console.log(response);
      if(response){
        navigate('/login', {replace: true});
      }
    }else{
        const response = await axios.post('/teacher/signupTeacher', 
        JSON.stringify({
            name: teacherDetails.name,
            email: teacherDetails.email,
            number: teacherDetails.number,
            password: teacherDetails.password,
            assignments: []
        }),
        {
            headers: {'content-type': 'application/json'},
            withCredentials: true
        });
        console.log(response);
        if(response){
            navigate('/login', {replace: true});
        }
    }
  };

  return (
    <div className="signup-container">
      <h2>Create an Account</h2>
      <div className="role-selector">
        <button
          className={selectedRole === 'student' ? 'active' : ''}
          onClick={() => handleRoleChange('student')}
        >
          Student
        </button>
        <button
          className={selectedRole === 'teacher' ? 'active' : ''}
          onClick={() => handleRoleChange('teacher')}
        >
          Teacher
        </button>
      </div>
      <form onSubmit={handleSubmit} className="signup-form">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          value={selectedRole === 'student' ? studentDetails.name : teacherDetails.name}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={selectedRole === 'student' ? studentDetails.email : teacherDetails.email}
          onChange={handleInputChange}
          required
        />

        <label htmlFor="number">Number</label>
        <input
          type="tel"
          id="number"
          value={selectedRole === 'student' ? studentDetails.number : teacherDetails.number}
          onChange={handleInputChange}
          required
        />

        {selectedRole === 'student' && (
          <>
            <label htmlFor="class">Class</label>
            <input
              type="text"
              id="class"
              value={studentDetails.class}
              onChange={handleInputChange}
              required
            />

            <label htmlFor="roll_no">Roll No</label>
            <input
              type="text"
              id="roll_no"
              value={studentDetails.roll_no}
              onChange={handleInputChange}
              required
            />
          </>
        )}

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={selectedRole === 'student' ? studentDetails.password : teacherDetails.password}
          onChange={handleInputChange}
          required
        />

        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
