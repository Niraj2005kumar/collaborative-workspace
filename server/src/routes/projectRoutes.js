import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import auth from "../middleware/auth.js";

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

export default router;