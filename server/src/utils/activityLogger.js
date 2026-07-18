const Activity = require("../models/Activity");

const logActivity = async (userId, action, entityType, entityId, entityName, workspaceId, projectId = null, details = "") => {
  try {
    await Activity.create({
      user: userId,
      action,
      entityType,
      entityId,
      entityName,
      workspace: workspaceId,
      project: projectId,
      details
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
};

module.exports = logActivity;
