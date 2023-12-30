import { useState } from 'react';
import './dashnavbarstudent.scss'
import { useDispatch } from 'react-redux'
import {setNavbar} from '../../../features/student/studentSlice'

const DashNavbarStudent = () => {
    const dispatch = useDispatch();
    const [activeNavItem, setActiveNavItem] = useState('pending');

    const handleNavItemClick = (item) => {
        dispatch(setNavbar(item))
        setActiveNavItem(item);
    };

  return (
    <div className="dashboard-container">
      <div className="secondary-nav">
        <div
          className={`nav-item ${activeNavItem === 'pending' ? 'active' : ''}`}
          onClick={() => handleNavItemClick('pending')}
        >
          Pending Assignment student
        </div>
        <div
          className={`nav-item ${activeNavItem === 'submitted' ? 'active' : ''}`}
          onClick={() => handleNavItemClick('submitted')}
        >
          Submitted Assignment
        </div>
        <div
          className={`nav-item ${activeNavItem === 'redo' ? 'active' : ''}`}
          onClick={() => handleNavItemClick('redo')}
        >
          Redo Assignment
        </div>
        <div
          className={`nav-item ${activeNavItem === 'checked' ? 'active' : ''}`}
          onClick={() => handleNavItemClick('checked')}
        >
          Checked Assignment
        </div>
      </div>
      {/* Add your dashboard content here */}
    </div>
  );
}

export default DashNavbarStudent