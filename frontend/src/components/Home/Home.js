import React from 'react'
import { useNavigate , Link } from 'react-router-dom'
import './home.scss'

const Home = () => {
  return (
    <div className="welcome-container">
      <h1>Welcome to EduBridge</h1>
      <div className="buttons-container">
        <Link to = '/login'><button className="login-btn">Login</button></Link>
        <Link to = '/login'><button className="login-btn">Sign Up</button></Link>
      </div>
    </div>
  );
}

export default Home