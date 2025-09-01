import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import PropTypes from 'prop-types';

const PrivateRoute = ({children}) => {

    const { user, loading } = useContext(AuthContext)
    const location = useLocation()

    if (loading){
        return <div className="hero min-h-screen"><span className="loading loading-bars loading-lg"></span></div>
    }

    if (user){
        return children
    }
    
    return <Navigate to='/login' state={location.pathname} replace></Navigate> 
};

export default PrivateRoute;

PrivateRoute.propTypes = {
    children: PropTypes.node
}     