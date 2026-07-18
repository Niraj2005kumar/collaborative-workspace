const Workspace = require("../models/Workspace");
const Project = require("../models/Project");
const Board = require("../models/Board");
const List = require("../models/List");
const Card = require("../models/Card");

exports.getAnalyticsTasks = async (req, res) => {
  try {
    const { workspaceId, projectId } = req.query;
    const userId = req.user.id;

    // Find workspaces where user is member
    const workspaces = await Workspace.find({ members: userId });
    const workspaceIds = workspaces.map(w => w._id.toString());

    if (workspaceId && !workspaceIds.includes(workspaceId)) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access to this workspace analytics"
      });
    }

    const targetWorkspaceIds = workspaceId ? [workspaceId] : workspaceIds;

    // Find projects in target workspaces
    const projects = await Project.find({ workspace: { $in: targetWorkspaceIds } });
    const projectIds = projects.map(p => p._id.toString());

    let targetProjectIds = projectIds;
    if (projectId) {
      if (!projectIds.includes(projectId)) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to this project analytics"
        });
      }
      targetProjectIds = [projectId];
    }

    // Find boards in target projects
    const boards = await Board.find({ project: { $in: targetProjectIds } });
    const boardIds = boards.map(b => b._id.toString());

    // Find lists in target boards
    const lists = await List.find({ board: { $in: boardIds } });
    const listIds = lists.map(l => l._id.toString());

    // Find cards in target lists
    const cards = await Card.find({ list: { $in: listIds } })
      .populate("assignee", "name email")
      .populate({
        path: "list",
        populate: {
          path: "board",
          populate: {
            path: "project"
          }
        }
      });

    // Format tasks for reporting & CSV/PDF export
    const tasksReport = cards.map(c => ({
      id: c._id,
      title: c.title,
      description: c.description || "",
      priority: c.priority,
      dueDate: c.dueDate ? c.dueDate.toISOString().split("T")[0] : "No due date",
      labels: (c.labels || []).join(", "),
      assigneeName: c.assignee ? c.assignee.name : "Unassigned",
      assigneeEmail: c.assignee ? c.assignee.email : "",
      columnName: c.list?.title || "Unknown",
      boardName: c.list?.board?.title || "Unknown",
      projectName: c.list?.board?.project?.name || "Unknown",
    }));

    res.status(200).json({
      success: true,
      tasks: tasksReport
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
