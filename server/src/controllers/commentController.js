const Comment = require("../models/Comment");
const Card = require("../models/Card");

exports.createComment = async (req, res) => {
  try {
    const { card, message } = req.body;

    if (!card || !message) {
      return res.status(400).json({
        success: false,
        message: "Card and message are required",
      });
    }

    const cardExists = await Card.findById(card);

    if (!cardExists) {
      return res.status(404).json({
        success: false,
        message: "Card not found",
      });
    }

    const comment = await Comment.create({
      user: req.user.id,
      card,
      message,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("card", "title");

    const io = req.app.get("io");

    io.to(`card:${card}`).emit("commentCreated", populatedComment);

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: populatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      card: req.params.cardId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const { message } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this comment",
      });
    }

    comment.message = message || comment.message;

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
      .populate("user", "name email")
      .populate("card", "title");

    const io = req.app.get("io");

    io.to(`card:${updatedComment.card._id}`).emit(
      "commentUpdated",
      updatedComment
    );

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      comment: updatedComment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (comment.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this comment",
      });
    }

    const cardId = comment.card;

    await Comment.findByIdAndDelete(req.params.id);

    const io = req.app.get("io");

    io.to(`card:${cardId}`).emit("commentDeleted", {
      commentId: req.params.id,
    });

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};