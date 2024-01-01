import React from 'react'
import DashNavbarInner from '../DashNav/DashNavbarInner/DashNavbarInner'
import AssignmentDetailInner from '../AssignmentDetailInner/AssignmentDetailInner'
import { getNavbar } from '../../features/teacher/teacherSlice'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

const AssignmentDetail = () => {
    const {id} = useParams();
    console.log(id);
    const navbar = useSelector(getNavbar);
    console.log(navbar);
  return (
    <>
        <DashNavbarInner/>
        <AssignmentDetailInner id = {id}/>
    </>
    
    
  )
}

export default AssignmentDetail