const Workspace = require("../models/Workspace");
const Project = require("../models/Project");
const Board = require("../models/Board");
const List = require("../models/List");
const Card = require("../models/Card");
const User = require("../models/User");

exports.searchEverything = async (req, res) => {
  try {
    const query = req.query.q;
    if (!query || query.trim() === "") {
      return res.status(200).json({
        success: true,
        results: { workspaces: [], projects: [], boards: [], lists: [], cards: [], members: [] }
      });
    }

    const userId = req.user.id;
    const regex = new RegExp(query, "i");

    // Get user's workspaces
    const workspacesList = await Workspace.find({ members: userId });
    const workspaceIds = workspacesList.map(w => w._id);

    // Get user's projects
    const projectsList = await Project.find({ workspace: { $in: workspaceIds } });
    const projectIds = projectsList.map(p => p._id);

    // Get user's boards
    const boardsList = await Board.find({ project: { $in: projectIds } });
    const boardIds = boardsList.map(b => b._id);

    // Get user's lists
    const listsList = await List.find({ board: { $in: boardIds } });
    const listIds = listsList.map(l => l._id);

    // Perform queries matching the search term
    const matchedWorkspaces = await Workspace.find({
      _id: { $in: workspaceIds },
      $or: [{ name: regex }, { description: regex }]
    });

    const matchedProjects = await Project.find({
      _id: { $in: projectIds },
      $or: [{ name: regex }, { description: regex }]
    });

    const matchedBoards = await Board.find({
      _id: { $in: boardIds },
      title: regex
    });

    const matchedLists = await List.find({
      _id: { $in: listIds },
      title: regex
    });

    const matchedCards = await Card.find({
      list: { $in: listIds },
      $or: [{ title: regex }, { description: regex }]
    })
      .populate("assignee", "name email")
      .populate({ path: "list", select: "board" });

    // Gather unique members across all user's workspaces
    const memberIds = [...new Set(workspacesList.flatMap(w => w.members.map(m => m.toString())))];
    const matchedMembers = await User.find({
      _id: { $in: memberIds },
      $or: [{ name: regex }, { email: regex }]
    }, "name email role");

    res.status(200).json({
      success: true,
      results: {
        workspaces: matchedWorkspaces,
        projects: matchedProjects,
        boards: matchedBoards,
        lists: matchedLists,
        cards: matchedCards,
        members: matchedMembers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
