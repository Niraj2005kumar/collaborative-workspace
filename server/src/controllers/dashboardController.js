const Workspace = require("../models/Workspace");
const Project = require("../models/Project");
const Board = require("../models/Board");
const List = require("../models/List");
const Card = require("../models/Card");

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find workspaces where user is member
    const workspaces = await Workspace.find({ members: userId });
    const workspaceIds = workspaces.map(w => w._id);

    // Find projects in these workspaces
    const projects = await Project.find({ workspace: { $in: workspaceIds } });
    const projectIds = projects.map(p => p._id);

    // Find boards in these projects
    const boards = await Board.find({ project: { $in: projectIds } });
    const boardIds = boards.map(b => b._id);

    // Find lists in these boards
    const lists = await List.find({ board: { $in: boardIds } });
    const listIds = lists.map(l => l._id);

    // Find cards in these lists
    const cards = await Card.find({ list: { $in: listIds } });

    // Group cards by priority
    const priorityStats = {
      High: cards.filter(c => c.priority === "High").length,
      Medium: cards.filter(c => c.priority === "Medium").length,
      Low: cards.filter(c => c.priority === "Low").length,
    };

    // Calculate progress: lists named 'done' or 'completed' are completed tasks
    const completedLists = lists
      .filter(l => 
        l.title.toLowerCase().includes("done") || 
        l.title.toLowerCase().includes("completed")
      )
      .map(l => l._id.toString());

    const totalCards = cards.length;
    const completedCards = cards.filter(c => completedLists.includes(c.list.toString())).length;
    const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 0;

    res.status(200).json({
      success: true,
      stats: {
        workspaceCount: workspaces.length,
        projectCount: projects.length,
        boardCount: boards.length,
        listCount: lists.length,
        cardCount: totalCards,
        priorityStats,
        completionRate,
        completedCards,
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
