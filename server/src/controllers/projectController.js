import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";

// Create Project
export const createProject = async (req, res) => {
  try {
    const { name, description, workspace, members, status, color } = req.body;

    if (!name || !workspace) {
      return res.status(400).json({
        success: false,
        message: "Project name and workspace are required",
      });
    }

    const existingWorkspace = await Workspace.findById(workspace);

    if (!existingWorkspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const project = await Project.create({
      name,
      description,
      workspace,
      owner: req.user.id,
      members: members || [],
      status,
      color,
    });

    const populatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("workspace", "name");

    res.status(201).json({
      success: true,
      message: "Project created successfully",
      project: populatedProject,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get All Projects of Workspace
export const getProjects = async (req, res) => {
  try {
    const { workspaceId } = req.params;

    const projects = await Project.find({
      workspace: workspaceId,
      isArchived: false,
    })
      .populate("owner", "name email")
      .populate("members", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: projects.length,
      projects,
    });
  } catch (error) {
    console.error("Get Projects Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Get Single Project
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("workspace", "name");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    res.status(200).json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("Get Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Update Project
export const updateProject = async (req, res) => {
  try {
    const { name, description, members, status, color } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    project.name = name || project.name;
    project.description = description ?? project.description;
    project.members = members || project.members;
    project.status = status || project.status;
    project.color = color || project.color;

    await project.save();

    const updatedProject = await Project.findById(project._id)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate("workspace", "name");

    res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    console.error("Update Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// Delete Project
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Delete Project Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};