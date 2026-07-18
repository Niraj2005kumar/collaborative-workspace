import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Workspace from "../pages/Workspace";
import WorkspaceSettings from "../pages/WorkspaceSettings";
import Board from "../pages/Board";
import Projects from "../pages/Projects";
import ProjectBoards from "../pages/ProjectBoards";
import ActivityLog from "../pages/ActivityLog";
import Analytics from "../pages/Analytics";

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
          {/* Redirect */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          {/* Workspace */}
          <Route
            path="/workspace"
            element={<Workspace />}
          />

          {/* Projects of a Workspace */}
          <Route
            path="/workspaces/:workspaceId/projects"
            element={<Projects />}
          />

          {/* Boards of a Project */}
          <Route
            path="/projects/:projectId"
            element={<ProjectBoards />}
          />

          {/* Backward Compatibility */}
          <Route
            path="/board/:boardId"
            element={<Board />}
          />

          {/* Workspace Settings */}
          <Route
            path="/workspace-settings"
            element={<WorkspaceSettings />}
          />

          {/* Activity Log */}
          <Route
            path="/activity-log"
            element={<ActivityLog />}
          />

          {/* Analytics */}
          <Route
            path="/analytics"
            element={<Analytics />}
          />
        </Route>

        {/* 404 */}
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: "center", marginTop: "50px" }}>
              404 - Page Not Found
            </h2>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;