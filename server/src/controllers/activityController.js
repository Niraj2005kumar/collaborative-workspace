const Activity = require("../models/Activity");
const Workspace = require("../models/Workspace");

exports.getActivities = async (req, res) => {
  try {
    const { workspaceId, entityType, action, page = 1, limit = 20, q } = req.query;

    // Filter by workspaces the user is a member of
    const userWorkspaces = await Workspace.find({ members: req.user.id });
    const userWorkspaceIds = userWorkspaces.map(w => w._id);

    const filter = {
      workspace: { $in: userWorkspaceIds }
    };

    if (workspaceId) {
      if (!userWorkspaceIds.map(id => id.toString()).includes(workspaceId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to this workspace activity logs"
        });
      }
      filter.workspace = workspaceId;
    }

    if (entityType) {
      filter.entityType = entityType;
    }

    if (action) {
      filter.action = action;
    }

    if (q) {
      filter.$or = [
        { entityName: new RegExp(q, "i") },
        { details: new RegExp(q, "i") }
      ];
    }

    const skip = (page - 1) * limit;

    const activities = await Activity.find(filter)
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await Activity.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: activities.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      activities
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
