import { useState,useEffect,useRef } from "react"
import useAuth from "../../hooks/useAuth";
import { Link , useNavigate, useLocation} from "react-router-dom";
import axios from '../../api/axios'
import './login.scss'

const Login = () => {
    const {setAuth} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location?.state?.from?.pathname || '/home';

    const userRef = useRef();
    const errRef = useRef();

    const [email,setEmail] = useState('');
    const [pass,setPass] = useState('');
    const [err,setErr] = useState('');
    const [role, setRole] = useState('teacher');
    useEffect(() => {
        userRef.current.focus();
    },[])

    useEffect(() => {
        setErr('');
    },[email,pass])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email,pass,role);
        try {
            if(role === 'teacher'){
                const response = await axios.post('/teacher/loginTeacher',
                JSON.stringify({email,password : pass}),
                {
                    headers: {'content-type': 'application/json'},
                    withCredentials: true
                });
                console.log(JSON.stringify(response?.data));
                console.log(role);

                const accessToken = response?.data?.token;
                setAuth({email,pass,role,accessToken})
                setEmail('');	
                setPass('');
                // navigate(from, {replace: true});
                navigate('/dashboard', {replace: true})
            }else{
                const response = await axios.post('/student/loginstudent',JSON.stringify({email,password : pass}),
                {
                    headers: {'content-type': 'application/json'},
                    withCredentials: true
                });
                console.log(JSON.stringify(response?.data));
                console.log(role);
                const accessToken = response?.data?.token;
                setAuth({email,pass,role,accessToken})
                setEmail('');	
                setPass('');
                // navigate(from, {replace: true});
                navigate('/dashboard', {replace: true})

            }
            
        } catch (error) {
            if(!error.response){
                setErr('No server response');
            } else if(error.response.status === 400){
                setErr(error.response.data.message);
            }else if(error.response.status === 401){
                setErr(error.response.data.message);
            }else if(error.response.status === 404){
                setErr(error.response.data.message);
            }else if(error.response.status === 500){
                setErr(error.response.data.message);
            }
        }
    }

    const handleChange = (e) => {
        setRole(e.target.value);
    }

    return (
        <div className="signup-container">
          <h2>Sign In</h2>
          <p ref={errRef} className={err ? "errmsg" : "offscreen"} aria-live="assertive">{err}</p>
          <form onSubmit={handleSubmit} className="signup-form">
    
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              ref={userRef}
              autoComplete="off"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
    
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPass(e.target.value)}
              value={pass}
              required
            />
    
            <label htmlFor="role">Role</label>
            <select
              onChange={handleChange}
              value={role}
              required
            >
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
    
            <button type="submit">Sign In</button>
          </form>
        </div>
      );
    
}

export default Login;
