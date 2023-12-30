import Login from './components/Login/Login';
import Layout from './components/Layout/Layout';
import Home from './components/Home/Home';
import {Routes , Route} from 'react-router-dom';
import RequireAuth from './components/RequireAuth/RequireAuth';
import RequireNoAuth from './components/RequireAuth/RequireNoAuth';
import Dashboard from './components/Dashboard/Dashboard';

function App() {
  return (
   <Routes>
    <Route path='/' element = {<Layout/>}>
      {/* Public pages */	 }
      <Route element = {<RequireNoAuth/>}>
        <Route path='login' element={<Login/>}/> 
        <Route path='/' element={<Home/>}/> 
      </Route>
      
      {/* Private pages */	 }
      <Route element = {<RequireAuth/>}>
        <Route path='dashboard' element={<Dashboard/>}/>
      </Route>
    </Route>
   </Routes>
  );  
}

export default App;
