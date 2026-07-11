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

router.post("/", auth, createWorkspace);

router.get("/", auth, getWorkspaces);

router.get("/:id", auth, getWorkspaceById);

router.put("/:id", auth, updateWorkspace);

router.delete("/:id", auth, deleteWorkspace);

router.post("/:id/invite", auth, inviteMember);

router.post("/:id/leave", auth, leaveWorkspace);

router.delete(
  "/:workspaceId/members/:memberId",
  auth,
  removeMember
);

module.exports = router;