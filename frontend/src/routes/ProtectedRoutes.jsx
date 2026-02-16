import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Role mismatch
  if (role && user.role !== role) {
    // redirect to correct dashboard
    return (
      <Navigate
        to={user.role === "admin" ? "/admin" : "/employee"}
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;
