import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import DashboardAdmin from "../pages/DashboardAdmin";
import TimesheetEmployee from "../pages/TimesheetEmployee";
import TimesheetAdmin from "../pages/TimesheetAdmin";

import PublicRoute from "./PublicRoute";
import ProtectedRoute from "./ProtectedRoutes";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/employee/timesheet"
          element={
            <ProtectedRoute role="employee">
              <TimesheetEmp />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <DashboardAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/timesheets"
          element={
            <ProtectedRoute role="admin">
              <TimesheetAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
