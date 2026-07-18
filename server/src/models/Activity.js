const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
      enum: ["created", "updated", "deleted", "moved", "commented", "invited", "removed"],
    },

    entityType: {
      type: String,
      required: true,
      enum: ["Workspace", "Project", "Board", "List", "Card", "Comment", "Invite"],
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    entityName: {
      type: String,
      required: true,
    },

    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    details: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Activity", activitySchema);
