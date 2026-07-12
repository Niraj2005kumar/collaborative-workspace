const Board = require("../models/Board");
const Workspace = require("../models/Workspace");

// Create Board
exports.createBoard = async (req, res) => {
  try {
    const { title, workspace } = req.body;

    if (!title || !workspace) {
      return res.status(400).json({
        success: false,
        message: "Title and Workspace are required",
      });
    }

    const workspaceExists = await Workspace.findById(workspace);

    if (!workspaceExists) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    const board = await Board.create({
      title,
      workspace,
    });

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

// Get All Boards of a Workspace
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({
      workspace: req.params.workspaceId,
    });

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
};

// Update Board
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