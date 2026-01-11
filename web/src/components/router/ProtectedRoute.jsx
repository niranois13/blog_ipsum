import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute() {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) {
        return <p>Checking authentication...</p>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
