import { useEffect } from 'react'
import DashNavbarStudent from '../DashNav/DashNavbarStudent/DashNavbarStudent'
import DashNavbarTeacher from '../DashNav/DashNavbarTeacher/DashNavbarTeacher'
import { useSelector,useDispatch } from 'react-redux'; 
import { getRole } from '../../features/user/userSlice';
import { fetchAsyncRole } from '../../features/user/userSlice'
import AssignmentList from '../AssignmentList.js/AssignmentList';
import AssignmentListTeacher from '../AssignmentListTeacher/AssignmentListTeacher';

const Dashboard = () => {
    const dispatch = useDispatch();
    const role = useSelector(getRole);

    useEffect(() => {
    dispatch(fetchAsyncRole());
    },[dispatch])
  return (
    <>
        {role === 'teacher' ? <DashNavbarTeacher/> : <DashNavbarStudent/>}
        {role === 'student' ? <AssignmentList/> : <AssignmentListTeacher/>}
        
    </>
  )
}

export default Dashboard