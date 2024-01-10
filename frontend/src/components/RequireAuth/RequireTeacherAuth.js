import { useSelector } from "react-redux";
import { getRole } from "../../features/user/userSlice";
import { Outlet } from "react-router-dom";

const RequireTeacherAuth = () => {
    const role = useSelector(getRole);
    return (
        role === 'teacher' 
            ? <Outlet /> 
                : <h1>Not authorized</h1>
    )
};
export default RequireTeacherAuth;