const List = require("../models/List");
const Board = require("../models/Board");

// ==========================
// Create List
// ==========================
exports.createList = async (req, res) => {
  try {
    const { title, board, position } = req.body;

    if (!title || !board) {
      return res.status(400).json({
        success: false,
        message: "Title and Board are required",
      });
    }

    const boardExists = await Board.findById(board);

    if (!boardExists) {
      return res.status(404).json({
        success: false,
        message: "Board not found",
      });
    }

    const list = await List.create({
      title,
      board,
      position: position ?? 0,
    });

    res.status(201).json({
      success: true,
      message: "List created successfully",
      list,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Get All Lists of a Board
// ==========================
exports.getLists = async (req, res) => {
  try {
    const lists = await List.find({
      board: req.params.boardId,
    }).sort({
      position: 1,
    });

    res.status(200).json({
      success: true,
      count: lists.length,
      lists,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update List
// ==========================
exports.updateList = async (req, res) => {
  try {
    const { title, position } = req.body;

    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    if (title) {
      list.title = title;
    }

    if (position !== undefined) {
      list.position = position;
    }

    await list.save();

    res.status(200).json({
      success: true,
      message: "List updated successfully",
      list,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Delete List
// ==========================
exports.deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);

    if (!list) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    await List.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "List deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================
// Update List Positions
// (Drag & Drop)
// ==========================
exports.updateListPosition = async (req, res) => {
  try {
    const { lists } = req.body;

    if (!lists || !Array.isArray(lists)) {
      return res.status(400).json({
        success: false,
        message: "Lists data is required",
      });
    }

    for (const list of lists) {
      await List.findByIdAndUpdate(list._id, {
        position: list.position,
      });
    }

    res.status(200).json({
      success: true,
      message: "List positions updated successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};