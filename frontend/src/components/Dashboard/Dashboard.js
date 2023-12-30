import { useEffect } from 'react'
import DashLayout from '../DashLayout/DashLayout'
import DashNavbarStudent from '../DashNav/DashNavbarStudent/DashNavbarStudent'
import DashNavbarTeacher from '../DashNav/DashNavbarTeacher/DashNavbarTeacher'
import { useSelector,useDispatch } from 'react-redux';
import { getNavbar } from '../../features/student/studentSlice';  
import { getRole } from '../../features/user/userSlice';
import { fetchAsyncRole } from '../../features/user/userSlice'
import AssignmentList from '../AssignmentList.js/AssignmentList';

const Dashboard = () => {
    const dispatch = useDispatch();
    const navbar = useSelector(getNavbar);
    const role = useSelector(getRole);
    // const [role, setRole] = useState('');

    useEffect(() => {
    dispatch(fetchAsyncRole());
    },[dispatch])
  return (
    <>
        <DashLayout/>
        {role === 'teacher' ? <DashNavbarTeacher/> : <DashNavbarStudent/>}
        <AssignmentList/>
    </>
  )
}

export default Dashboard