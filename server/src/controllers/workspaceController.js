const Workspace = require("../models/Workspace");
const User = require("../models/User");

// Create Workspace
exports.createWorkspace = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required",
      });
    }

    const workspace = await Workspace.create({
      name,
      description,
      visibility,
      owner: req.user.id,
      members: [req.user.id],
    });

    await User.findByIdAndUpdate(req.user.id, {
      $push: { workspaces: workspace._id },
    });

    res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      workspace,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get All Workspaces
exports.getWorkspaces = async (req, res) => {
  try {
    const workspaces = await Workspace.find({
      members: req.user.id,
    })
      .populate("owner", "name email")
      .populate("members", "name email");

    res.status(200).json({
      success: true,
      count: workspaces.length,
      workspaces,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get Single Workspace
exports.getWorkspaceById = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id)
      .populate("owner", "name email")
      .populate("members", "name email");

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    res.status(200).json({
      success: true,
      workspace,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update Workspace
exports.updateWorkspace = async (req, res) => {
  try {
    const { name, description, visibility } = req.body;

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Only owner can update
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this workspace",
      });
    }

    if (name) workspace.name = name;
    if (description !== undefined) workspace.description = description;
    if (visibility) workspace.visibility = visibility;

    await workspace.save();

    res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      workspace,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Workspace
exports.deleteWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }


    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this workspace",
      });
    }

    await User.updateMany(
      {
        workspaces: workspace._id,
      },
      {
        $pull: {
          workspaces: workspace._id,
        },
      }
    );

    await Workspace.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Invite Member
exports.inviteMember = async (req, res) => {
  try {
    const { email } = req.body;


    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owner can invite members",
      });
    }


    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }


    if (workspace.members.includes(user._id)) {
      return res.status(400).json({
        success: false,
        message: "User is already a member",
      });
    }


    workspace.members.push(user._id);
    await workspace.save();


    user.workspaces.push(workspace._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Member invited successfully",
      workspace,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Leave Workspace
exports.leaveWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findById(req.params.id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    if (workspace.owner.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Workspace owner cannot leave the workspace. Delete it instead.",
      });
    }


    if (!workspace.members.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: "You are not a member of this workspace.",
      });
    }

    workspace.members.pull(req.user.id);
    await workspace.save();

    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        workspaces: workspace._id,
      },
    });

    res.status(200).json({
      success: true,
      message: "You left the workspace successfully.",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { workspaceId, memberId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found",
      });
    }

    // Only owner can remove members
    if (workspace.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Only workspace owner can remove members",
      });
    }

    // Owner cannot remove themselves
    if (workspace.owner.toString() === memberId) {
      return res.status(400).json({
        success: false,
        message: "Workspace owner cannot be removed",
      });
    }

    // Check member exists
    if (!workspace.members.includes(memberId)) {
      return res.status(404).json({
        success: false,
        message: "Member not found in workspace",
      });
    }

    // Remove member from workspace
    workspace.members.pull(memberId);
    await workspace.save();

    // Remove workspace from user's list
    await User.findByIdAndUpdate(memberId, {
      $pull: {
        workspaces: workspace._id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};