const Card = require("../models/Card");
const List = require("../models/List");

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
    });

    res.status(201).json({
      success: true,
      message: "Card created successfully",
      card,
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
    if (assignee) card.assignee = assignee;
    if (priority) card.priority = priority;
    if (dueDate) card.dueDate = dueDate;
    if (list) card.list = list;
    if (position !== undefined) card.position = position;

    await card.save();

    res.status(200).json({
      success: true,
      message: "Card updated successfully",
      card,
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

    await Card.findByIdAndDelete(req.params.id);

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