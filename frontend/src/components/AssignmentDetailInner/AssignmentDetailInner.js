import {useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { fetchAssignmentResponse, getResponse ,getNavbar,getCorrected,fetchCorrectedAssignments} from '../../features/teacher/teacherSlice'
import AssignmentResponse from '../AssignmentCard/AssignmentResponse'
import AssignmentCorrected from '../AssignmentCard/AssignmentCorrected'
import NoResponse from '../NoResponses/NoResponse'

const AssignmentDetailInner = ({id}) => {
    const dispatch = useDispatch();
    const response = useSelector(getResponse);
    const corrected = useSelector(getCorrected);
    const menu = useSelector(getNavbar);
    useEffect(() => {
        dispatch(fetchAssignmentResponse(id));
        dispatch(fetchCorrectedAssignments(id));
    },[dispatch,id,menu])

    let renderElement = ''

    renderElement = menu === 'response' ? (
        response.length === 0 ? (
            <NoResponse title = {"No responses yet"}/>
        ) : (
            <div>
                {response.slice().reverse().map((item) => (
                    <AssignmentResponse key={item.id} item={item}/>
                ))}
            </div>
        )
    ) : (
        corrected.length === 0 ? (
            <NoResponse title = {"No corrected assignments yet"}/>
        ) : (
            <div>
                {corrected.slice().reverse().map((item) => (
                    <AssignmentCorrected key={item.id} item={item}/>
                ))}
            </div>
        )
    )
  return (
    <>
        {renderElement}
    </>
  )
}

export default AssignmentDetailInner