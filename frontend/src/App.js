import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import {Routes , Route} from 'react-router-dom';
import RequireAuth from './components/RequireAuth/RequireAuth';
import RequireNoAuth from './components/RequireAuth/RequireNoAuth';
import RequireTeacherAuth from './components/RequireAuth/RequireTeacherAuth';
import DashLayout from './components/DashLayout/DashLayout';
import Dashboard from './components/Dashboard/Dashboard';
import CreateAssignment from './components/CreateAssignment/CreateAssignment';
import AssignmentDetail from './components/AssignmentDetails/AssignmentDetail';
import Signup from './components/signup/Signup';


function App() {
  return (
   <Routes>
    <Route path='/' element = {<Layout/>}>
      {/* Public pages */	 }
      <Route element = {<RequireNoAuth/>}>
        <Route path='login' element={<Login/>}/> 
        <Route path='signup' element={<Signup/>}/>
        <Route path='/' element={<Home/>}/> 
      </Route>
      
      {/* Private pages */	 }
      <Route element = {<RequireAuth/>}>
        <Route path='dashboard' element={<DashLayout/>}>
          <Route path = '' element={<Dashboard/>}/>
          <Route element = {<RequireTeacherAuth/>}>
            <Route path='createassignment' element={<CreateAssignment/>}/>
            <Route path=':id' element={<AssignmentDetail/>}/> 
          </Route>
        </Route>
      </Route>
    </Route>
   </Routes>
  );  
}

export default App;
