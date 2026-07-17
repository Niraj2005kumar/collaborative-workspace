const Board = require("../models/Board");
const Workspace = require("../models/Workspace");
const Project = require("../models/Project");

// Create Board
exports.createBoard = async (req, res) => {
  try {
    const { title, workspace, project } = req.body;

    if (!title || !workspace || !project) {
      return res.status(400).json({
        success: false,
        message: "Title, Workspace and Project are required",
      });
    }

    const workspaceExists = await Workspace.findById(workspace);

    if (!workspaceExists) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const projectExists = await Project.findById(project);

    if (!projectExists) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      });
    }

    const board = await Board.create({
      title,
      workspace,
      project,
    });

    projectExists.boards.push(board._id);
    await projectExists.save();

    res.status(201).json({
      success: true,
      message: "Board created successfully",
      board,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Boards of a Project
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      project: req.params.projectId,
    })
      .populate("workspace", "name")
      .populate("project", "name");

    res.status(200).json({
      success: true,
      count: boards.length,
      boards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};// Update Board
exports.updateBoard = async (req, res) => {
  try {
    const { title } = req.body;

    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    if (title) {
      board.title = title;
    }

    await board.save();

    res.status(200).json({
      success: true,
      message: "Board updated successfully",
      board,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Board
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    // Remove board reference from Project
    await Project.findByIdAndUpdate(board.project, {
      $pull: {
        boards: board._id,
      },
    });

    await Board.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Board deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};