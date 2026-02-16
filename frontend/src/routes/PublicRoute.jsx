import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/employee/timesheet"}
        replace
      />
    );
  }

  return children;
};

export default PublicRoute;
