import {useEffect} from 'react'
import { useSelector , useDispatch} from 'react-redux';
import { getAssignment, fetchAssignments } from '../../features/teacher/teacherSlice';
import AssignmentTeacher from '../AssignmentCard/AssignmentTeacher';
import NoResponse from '../NoResponses/NoResponse';

const AssignmentListTeacher = () => {
    const dispatch = useDispatch();

    const assignment = useSelector(getAssignment);
    useEffect(() => {
        dispatch(fetchAssignments());
    },[dispatch])
  return (
    <>
        {assignment.length === 0 ? <NoResponse title = 'No Assignments Yet'/> :
        assignment.slice().reverse().map((item, index) => {
            return (
                <AssignmentTeacher key = {index} item = {item}/>
            )
        })
        }
    </>
  )
}

export default AssignmentListTeacher