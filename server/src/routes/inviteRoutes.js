const express = require("express");

const {
  inviteUser,
  acceptInvite,
  rejectInvite,
  getWorkspaceMembers,
} = require("../controllers/inviteController");

const auth = require("../middleware/auth");

const router = express.Router();


router.post("/:id", auth, inviteUser);

router.post("/:id/accept", auth, acceptInvite);

router.post("/:id/reject", auth, rejectInvite);

router.get("/:id/members", auth, getWorkspaceMembers);

module.exports = router;