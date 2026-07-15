import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================
// Attach JWT Token
// ==========================

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

// ==========================
// Authentication APIs
// ==========================

export const registerUser = (data) =>
  api.post("/auth/register", data);

export const loginUser = (data) =>
  api.post("/auth/login", data);

export const getProfile = () =>
  api.get("/auth/profile");

// ==========================
// Workspace APIs
// ==========================

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
  api.delete(`/workspaces/${workspaceId}/members/${memberId}`);

// ==========================
// Invitation APIs
// ==========================

export const sendInvite = (workspaceId, data) =>
  api.post(`/invites/${workspaceId}`, data);

export const acceptInvite = (inviteId) =>
  api.post(`/invites/${inviteId}/accept`);

export const rejectInvite = (inviteId) =>
  api.post(`/invites/${inviteId}/reject`);

export const getWorkspaceMembers = (workspaceId) =>
  api.get(`/invites/${workspaceId}/members`);

// ==========================
// Board APIs
// ==========================

export const getBoards = (workspaceId) =>
  api.get(`/boards/${workspaceId}`);

export const createBoard = (data) =>
  api.post("/boards", data);

export const updateBoard = (id, data) =>
  api.put(`/boards/${id}`, data);

export const deleteBoard = (id) =>
  api.delete(`/boards/${id}`);

// ==========================
// List APIs
// ==========================

export const getLists = (boardId) =>
  api.get(`/lists/${boardId}`);

export const createList = (data) =>
  api.post("/lists", data);

export const updateList = (id, data) =>
  api.put(`/lists/${id}`, data);

export const deleteList = (id) =>
  api.delete(`/lists/${id}`);

// ==========================
// Card APIs
// ==========================

export const getCards = (listId) =>
  api.get(`/cards/${listId}`);

export const createCard = (data) =>
  api.post("/cards", data);

export const updateCard = (id, data) =>
  api.put(`/cards/${id}`, data);

export const deleteCard = (id) =>
  api.delete(`/cards/${id}`);

// ⭐ Drag & Drop Position Update
export const updateCardPosition = (cards) =>
  api.put("/cards/reorder", {
    cards,
  });



export const getComments = (cardId) =>
  api.get(`/comments/${cardId}`);

export const createComment = (data) =>
  api.post("/comments", data);

export const updateComment = (id, data) =>
  api.put(`/comments/${id}`, data);

export const deleteComment = (id) =>
  api.delete(`/comments/${id}`);

export default api;