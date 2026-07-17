const express = require("express");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const auth = require("../middleware/auth");

const router = express.Router();

// Create Project
router.post("/", auth, createProject);

// Get All Projects of a Workspace
router.get("/workspace/:workspaceId", auth, getProjects);

// Get Single Project
router.get("/:id", auth, getProjectById);

// Update Project
router.put("/:id", auth, updateProject);

// Delete Project
router.delete("/:id", auth, deleteProject);

module.exports = router;