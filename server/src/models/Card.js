const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },

    dueDate: {
      type: Date,
    },

    list: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "List",
      required: true,
    },

    position: {
      type: Number,
      default: 0,
    },

    labels: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Card", cardSchema);