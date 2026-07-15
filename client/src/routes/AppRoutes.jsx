import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Workspace from "../pages/Workspace";
import WorkspaceSettings from "../pages/WorkspaceSettings";
import Board from "../pages/Board";

import ProtectedRoute from "./ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/workspace"
            element={<Workspace />}
          />

          {/* Board Page */}
          <Route
            path="/board/:boardId"
            element={<Board />}
          />

          <Route
            path="/workspace-settings"
            element={<WorkspaceSettings />}
          />
        </Route>

        {/* 404 Page */}
        <Route
          path="*"
          element={<h2 style={{ textAlign: "center", marginTop: "50px" }}>404 - Page Not Found</h2>}
        />

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;