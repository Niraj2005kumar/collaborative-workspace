const express = require("express");

const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  leaveWorkspace,
  removeMember,
} = require("../controllers/workspaceController");

const auth = require("../middleware/auth");

const router = express.Router();

// Create Workspace
router.post("/", auth, createWorkspace);

// Get All Workspaces for user
router.get("/", auth, getWorkspaces);

// Get Single Workspace
router.get("/:id", auth, getWorkspaceById);

// Update Workspace
router.put("/:id", auth, updateWorkspace);

// Delete Workspace
router.delete("/:id", auth, deleteWorkspace);

// Invite Member to Workspace
router.post("/:id/invite", auth, inviteMember);

// Leave Workspace
router.post("/:id/leave", auth, leaveWorkspace);

// Remove member from workspace
router.delete("/:workspaceId/members/:memberId", auth, removeMember);

module.exports = router;