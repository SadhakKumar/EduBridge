import {useState} from 'react'
import { useDispatch } from 'react-redux'
import './dashnavbarinner.scss';
import { setNavbar } from '../../../features/teacher/teacherSlice';

const DashNavbarInner = () => {
    const dispatch = useDispatch();
    const [activeNavItem, setActiveNavItem] = useState('response');

    const handleNavItemClick = (item) => {
        setActiveNavItem(item);
        dispatch(setNavbar(item));
    };
    return (
        <div className="dashboard-container">
          <div className="secondary-nav">
            <div
              className={`nav-item ${activeNavItem === 'response' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('response')}
            >
              Responses
            </div>
            <div
              className={`nav-item ${activeNavItem === 'checked' ? 'active' : ''}`}
              onClick={() => handleNavItemClick('checked')}
            >
              Checked Assignment
            </div>
          </div>
        </div>
    )
}

export default DashNavbarInner