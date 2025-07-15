import { Navigate,Outlet} from 'react-router-dom'


const PrivateRoute = ({allowedRoles}) =>{
    const isAuthenticated = !!localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const role = user?.role;
    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    if(!allowedRoles.includes(role)){
        return <Navigate to="/unauthorized" replace />;
    }
    return <Outlet />;
    
}
export default PrivateRoute