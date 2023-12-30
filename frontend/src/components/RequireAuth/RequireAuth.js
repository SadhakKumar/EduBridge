import { useLocation, Navigate,Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();
    // const [cookies] = useCookies(['userInfo']);
    // const hasUserInfo = cookies && cookies.userInfo;
    console.log(Cookies.get('userInfo'));

    return (
        Cookies.get('userInfo')
            ? <Outlet />
                : <Navigate to='/login' state={{from : location}} replace/>
    );
    
}
export default RequireAuth;