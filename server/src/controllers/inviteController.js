const Invite = require("../models/Invite");
const Workspace = require("../models/Workspace");
const User = require("../models/User");


exports.inviteUser = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const receiver = await User.findOne({ email });

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found",
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

    if (
        workspace.members.some(
        member => member.toString() === receiver._id.toString()
        )
        ) {
            return res.status(400).json({
                success: false,
                message: "User is already a member",
            });
        }
    const alreadyInvited = await Invite.findOne({
      receiver: receiver._id,
      workspace: workspace._id,
      status: "pending",
    });

    if (alreadyInvited) {
      return res.status(400).json({
        success: false,
        message: "Invitation already sent",
      });
    }

    const invite = await Invite.create({
      sender: req.user.id,
      receiver: receiver._id,
      workspace: workspace._id,
    });

    res.status(201).json({
      success: true,
      message: "Invitation sent successfully",
      invite,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.acceptInvite = async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    if (invite.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to accept this invitation",
      });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Invitation already processed",
      });
    }

    invite.status = "accepted";
    await invite.save();

    await Workspace.findByIdAndUpdate(invite.workspace, {
      $addToSet: {
        members: invite.receiver,
      },
    });

    await User.findByIdAndUpdate(invite.receiver, {
      $addToSet: {
        workspaces: invite.workspace,
      },
    });

    res.status(200).json({
      success: true,
      message: "Invitation accepted successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.rejectInvite = async (req, res) => {
  try {
    const invite = await Invite.findById(req.params.id);

    if (!invite) {
      return res.status(404).json({
        success: false,
        message: "Invitation not found",
      });
    }

    if (invite.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to reject this invitation",
      });
    }

    if (invite.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Invitation already processed",
      });
    }

    invite.status = "rejected";
    await invite.save();

    res.status(200).json({
      success: true,
      message: "Invitation rejected successfully",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getWorkspaceMembers = async (req, res) => {
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
      count: workspace.members.length,
      members: workspace.members,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};