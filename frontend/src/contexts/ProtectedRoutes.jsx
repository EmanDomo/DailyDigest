import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext"; // Ensure the correct path


const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // If there's no user or user is null, redirect to login
    if (!user || user === null) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/forbidden" replace />;
    }

    return children;
};

export default ProtectedRoute;