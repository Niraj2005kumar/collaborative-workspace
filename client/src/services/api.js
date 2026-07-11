import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ==========================
   Authentication APIs
========================== */

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");

/* ==========================
   Workspace APIs
========================== */

export const getWorkspaces = () =>
  api.get("/workspaces");

export const getWorkspaceById = (id) =>
  api.get(`/workspaces/${id}`);

export const createWorkspace = (data) =>
  api.post("/workspaces", data);

export const updateWorkspace = (id, data) =>
  api.put(`/workspaces/${id}`, data);

export const deleteWorkspace = (id) =>
  api.delete(`/workspaces/${id}`);

export const leaveWorkspace = (id) =>
  api.post(`/workspaces/${id}/leave`);

export const inviteMember = (id, data) =>
  api.post(`/workspaces/${id}/invite`, data);

export const removeMember = (workspaceId, memberId) =>
  api.delete(
    `/workspaces/${workspaceId}/members/${memberId}`
  );

/* ==========================
   Invitation APIs
========================== */

export const sendInvite = (workspaceId, data) =>
  api.post(`/invites/${workspaceId}`, data);

export const acceptInvite = (inviteId) =>
  api.post(`/invites/${inviteId}/accept`);

export const rejectInvite = (inviteId) =>
  api.post(`/invites/${inviteId}/reject`);

export const getWorkspaceMembers = (workspaceId) =>
  api.get(`/invites/${workspaceId}/members`);

export default api;