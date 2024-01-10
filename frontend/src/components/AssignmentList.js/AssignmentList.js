import {useEffect} from 'react'
import { useSelector , useDispatch} from 'react-redux';
import { getNavbar , getPending ,fetchAsyncPending,getChecked,getRedo,getSubmitted,fetchAsyncChecked,fetchAsyncRedo,fetchAsyncSubmitted} from '../../features/student/studentSlice';
import PendingAssignment from '../AssignmentCard/PendingAssignment';
import SubmittedAssignment from '../AssignmentCard/SubmittedAssignment';
import RedoAssignment from '../AssignmentCard/RedoAssignment';
import CheckedAssignments from '../AssignmentCard/CheckedAssignments';
import NoResponse from '../NoResponses/NoResponse';

const AssignmentList = () => {
    const menu = useSelector(getNavbar);
    const dispatch = useDispatch();

    const pending = useSelector(getPending);
    const checked = useSelector(getChecked);
    const redo = useSelector(getRedo);
    const submitted = useSelector(getSubmitted);
    useEffect(() => {
        dispatch(fetchAsyncPending());
        dispatch(fetchAsyncChecked());
        dispatch(fetchAsyncSubmitted());
        dispatch(fetchAsyncRedo());
    },[dispatch])


    let renderElements = "";

    renderElements = menu === 'pending' ? (
        pending.length === 0 ? (
            <NoResponse title = {"No pending assignments"}/>
        ) : (
            pending.slice().reverse().map((item, index) => {
                return (
                    <PendingAssignment key={index} item={item}/>
                )
        }))
    ) : menu === 'submitted' ? (
        submitted.length === 0 ? (
            <NoResponse title = {"No submitted assignments"}/>
        ) : (
        submitted.slice().reverse().map((item, index) => {
            return (
                <SubmittedAssignment key={index} item={item}/>
            )
        }))
    ) : menu === 'redo' ? (
        redo.length === 0 ? (
            <NoResponse title = {"No redo assignments"}/>
        ) : (
        redo.slice().reverse().map((item, index) => {
            return (
                <RedoAssignment key={index} item={item}/>
            )
        }))
    ):(
        checked.length === 0 ? (
            <NoResponse title = {"No checked assignments"}/>
        ) : (
        checked.slice().reverse().map((item, index) => {
            return (
                <CheckedAssignments key={index} item={item}/>
            )
        }))
    )
  return (
    <div>
        {renderElements}
    </div>
  )
}

export default AssignmentList