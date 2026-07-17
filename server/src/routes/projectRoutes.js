import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create Project
router.post("/", protect, createProject);

// Get All Projects of a Workspace
router.get("/workspace/:workspaceId", protect, getProjects);

// Get Single Project
router.get("/:id", protect, getProjectById);

// Update Project
router.put("/:id", protect, updateProject);

// Delete Project
router.delete("/:id", protect, deleteProject);

export default router;