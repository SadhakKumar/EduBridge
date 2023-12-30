import {useEffect} from 'react'
import { useSelector , useDispatch} from 'react-redux';
import { getNavbar , getPending ,fetchAsyncPending,getChecked,getRedo,getSubmitted,fetchAsyncChecked,fetchAsyncRedo,fetchAsyncSubmitted} from '../../features/student/studentSlice';
import PendingAssignment from '../AssignmentCard/PendingAssignment';
import SubmittedAssignment from '../AssignmentCard/SubmittedAssignment';
import RedoAssignment from '../AssignmentCard/RedoAssignment';
import CheckedAssignments from '../AssignmentCard/CheckedAssignments';

const AssignmentList = () => {
    const menu = useSelector(getNavbar);
    const dispatch = useDispatch();

    const pending = useSelector(getPending);
    console.log(pending);
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
        pending.map((item, index) => {
            return (
                <PendingAssignment key={index} item={item}/>
            )
        })
    ) : menu === 'submitted' ? (
        submitted.map((item, index) => {
            return (
                <SubmittedAssignment key={index} item={item}/>
            )
        })
    ) : menu === 'redo' ? (
        redo.map((item, index) => {
            return (
                <RedoAssignment key={index} item={item}/>
            )
        })
    ):(
        checked.map((item, index) => {
            return (
                <CheckedAssignments key={index} item={item}/>
            )
        })
    )
  return (
    <div>
        {renderElements}
    </div>
  )
}

export default AssignmentList