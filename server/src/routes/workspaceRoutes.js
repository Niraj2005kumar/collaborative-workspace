const express = require("express");

const {
  createWorkspace,
  getWorkspaces,
  getWorkspaceById,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  leaveWorkspace,
} = require("../controllers/workspaceController");

const auth = require("../middleware/auth");

const router = express.Router();



// Create Workspace
router.post("/", auth, createWorkspace);

// Get All Workspaces
router.get("/", auth, getWorkspaces);

// Get Single Workspace
router.get("/:id", auth, getWorkspaceById);

// Update Workspace
router.put("/:id", auth, updateWorkspace);

// Delete Workspace
router.delete("/:id", auth, deleteWorkspace);

// Invite Member
router.post("/:id/invite", auth, inviteMember);

// Leave Workspace
router.post("/:id/leave", auth, leaveWorkspace);

module.exports = router;