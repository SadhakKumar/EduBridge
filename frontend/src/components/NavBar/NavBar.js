import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import './navbar.scss';

const NavBar = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() - 1); 
      document.cookie = `userInfo=; expires=${expirationDate.toUTCString()}; path=/;`;
      navigate('/login');
      console.log('Logging out...');
    };
    return (
        <div className="navbar-container">
          <div className="logo-container">
            <span className="logo">EduBridge</span>
          </div>
          <div className="profile-container">
            <div className="profile-wrapper" onClick={toggleDropdown}>
              <img
                src="path/to/user-profile-icon.png"  // Replace with the actual path or use an icon library
                alt="User Profile"
                className="profile-icon"
              />
              {isDropdownOpen && (
                <div className="dropdown">
                  <button onClick={() => console.log('View Profile')}>Profile</button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>
      );
}

export default NavBar