const Card = require("../models/Card");
const List = require("../models/List");
const Board = require("../models/Board");
const logActivity = require("../utils/activityLogger");

// Create Card
exports.createCard = async (req, res) => {
  try {
    const {
      title,
      description,
      assignee,
      priority,
      dueDate,
      list,
      position,
      labels,
    } = req.body;

    if (!title || !list) {
      return res.status(400).json({
        success: false,
        message: "Title and List are required",
      });
    }

    const listExists = await List.findById(list);

    if (!listExists) {
      return res.status(404).json({
        success: false,
        message: "List not found",
      });
    }

    const card = await Card.create({
      title,
      description,
      assignee,
      priority,
      dueDate,
      list,
      position,
      labels: labels || [],
    });

    const populatedCard = await Card.findById(card._id).populate(
      "assignee",
      "name email"
    );

    const boardExists = await Board.findById(listExists.board);
    if (boardExists) {
      logActivity(
        req.user.id,
        "created",
        "Card",
        card._id,
        card.title,
        boardExists.workspace,
        boardExists.project,
        `Created task card "${card.title}"`
      );
    }

    const io = req.app.get("io");

    io.to(`list:${list}`).emit("cardCreated", populatedCard);

    res.status(201).json({
      success: true,
      message: "Card created successfully",
      card: populatedCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Cards of a List
exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({
      list: req.params.listId,
    })
      .populate("assignee", "name email")
      .sort({
        position: 1,
      });

    res.status(200).json({
      success: true,
      count: cards.length,
      cards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Card
exports.updateCard = async (req, res) => {
  try {
    const {
      title,
      description,
      assignee,
      priority,
      dueDate,
      list,
      position,
      labels,
    } = req.body;

    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    if (title) card.title = title;
    if (description !== undefined) card.description = description;
    if (assignee !== undefined) card.assignee = assignee || null;
    if (priority) card.priority = priority;
    if (dueDate !== undefined) card.dueDate = dueDate || null;
    if (list) card.list = list;
    if (position !== undefined) card.position = position;
    if (labels !== undefined) card.labels = labels;

    await card.save();

    const updatedCard = await Card.findById(card._id).populate(
      "assignee",
      "name email"
    );

    const listExists = await List.findById(updatedCard.list);
    const boardExists = await Board.findById(listExists.board);
    if (boardExists) {
      const isMove = list && (list.toString() !== card.list.toString());
      const actionDetails = isMove 
        ? `Moved task to column "${listExists.title}"` 
        : `Updated task details`;
      logActivity(
        req.user.id,
        isMove ? "moved" : "updated",
        "Card",
        updatedCard._id,
        updatedCard.title,
        boardExists.workspace,
        boardExists.project,
        actionDetails
      );
    }

    const io = req.app.get("io");

    io.to(`list:${updatedCard.list}`).emit("cardUpdated", updatedCard);

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      card: updatedCard,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Card
exports.deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const listId = card.list;

    await Card.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");

    io.to(`list:${listId}`).emit("cardDeleted", {
      cardId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Card deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Update Card Positions (Drag & Drop)
exports.updateCardPosition = async (req, res) => {
  try {
    const { cards } = req.body;

    if (!cards || !Array.isArray(cards)) {
      return res.status(400).json({
        success: false,
        message: "Cards data is required",
      });
    }

    for (const card of cards) {
      await Card.findByIdAndUpdate(card._id, {
        position: card.position,
      });
    }

    const io = req.app.get("io");

    io.emit("cardPositionsUpdated", cards);

    res.status(200).json({
      success: true,
      message: "Card positions updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};