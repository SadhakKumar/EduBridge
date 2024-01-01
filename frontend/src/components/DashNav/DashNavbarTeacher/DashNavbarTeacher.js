import './dashnavbarteacher.scss';
import { useNavigate } from 'react-router-dom';

const DashNavbarTeacher = () => {
    const navigate = useNavigate();
    
    const onCreateNewAssignmentClick = () => {
        console.log("Create New Assignment Clicked" );
        navigate('/dashboard/createassignment');
    };
    return (
      <div className="teacher-dashboard-navbar">
        <h2>Your Assignments</h2>
        <button onClick={onCreateNewAssignmentClick}>Create New Assignment</button>
      </div>
    );
  
}

export default DashNavbarTeacher