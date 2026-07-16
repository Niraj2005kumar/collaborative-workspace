import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWorkspaces,
  updateWorkspace,
  deleteWorkspace,
  removeMember,
  inviteMember,
} from "../services/api";

const WorkspaceSettings = () => {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);

  // Form States
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState("private");

  const loadWorkspaceDetails = useCallback(async () => {
    try {
      const res = await getWorkspaces();
      const workspacesList = res.data.workspaces || [];
      const savedId = sessionStorage.getItem("selectedWorkspaceId");
      
      let currentWorkspace = null;
      if (savedId) {
        currentWorkspace = workspacesList.find(w => w._id === savedId);
      }
      if (!currentWorkspace && workspacesList.length > 0) {
        currentWorkspace = workspacesList[0];
      }

      if (currentWorkspace) {
        setWorkspace(currentWorkspace);
        setName(currentWorkspace.name || "");
        setDescription(currentWorkspace.description || "");
        setVisibility(currentWorkspace.visibility || "private");
      } else {
        navigate("/workspace");
      }
    } catch (err) {
      console.error("Failed to load workspace details:", err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadWorkspaceDetails();
  }, [loadWorkspaceDetails]);

  // Update Workspace Details
  const handleSaveChanges = async () => {
    if (!name.trim()) {
      alert("Workspace name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      await updateWorkspace(workspace._id, {
        name,
        description,
        visibility,
      });
      alert("Workspace changes saved successfully");
      loadWorkspaceDetails();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Invite Member
  const handleInviteMember = async (e) => {
    e.preventDefault();
    if (!inviteEmail.trim()) {
      alert("Please enter email to invite");
      return;
    }
    try {
      setInviteLoading(true);
      await inviteMember(workspace._id, { email: inviteEmail });
      alert("Invitation sent successfully!");
      setInviteEmail("");
      loadWorkspaceDetails();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to invite member");
    } finally {
      setInviteLoading(false);
    }
  };

  // Remove Member
  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    try {
      await removeMember(workspace._id, memberId);
      alert("Member removed successfully");
      loadWorkspaceDetails();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to remove member");
    }
  };

  // Delete Workspace
  const handleDeleteWorkspace = async () => {
    if (!window.confirm("CRITICAL: Are you sure you want to delete this workspace? This cannot be undone.")) return;
    try {
      await deleteWorkspace(workspace._id);
      sessionStorage.removeItem("selectedWorkspaceId");
      alert("Workspace deleted successfully");
      navigate("/workspace");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to delete workspace");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "var(--text-muted)" }}>Loading Workspace Settings...</h2>
      </div>
    );
  }

  if (!workspace) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2>No workspace selected</h2>
      </div>
    );
  }

  return (
    <div className="workspace-settings">
      <h1>Workspace Settings ({workspace.name})</h1>

      <div className="settings-card">
        <h2>General Details</h2>
        
        <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
          Workspace Name
        </label>
        <input
          type="text"
          placeholder="Enter workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
          Workspace Description
        </label>
        <textarea
          placeholder="Workspace Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
          Workspace Visibility
        </label>
        <select value={visibility} onChange={(e) => setVisibility(e.target.value)}>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>

        <button className="save-btn" onClick={handleSaveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="settings-card">
        <h2>Invite New Member</h2>
        <form onSubmit={handleInviteMember} style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          <input
            type="email"
            placeholder="User Email (e.g. user@gmail.com)"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            style={{ margin: 0, flex: 1 }}
            required
          />
          <button type="submit" className="create-btn" disabled={inviteLoading}>
            {inviteLoading ? "Inviting..." : "Invite Member"}
          </button>
        </form>

        <h2>Workspace Members</h2>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {workspace.members?.map((member) => {
                const isOwner = workspace.owner?._id === member._id;
                return (
                  <tr key={member._id}>
                    <td style={{ fontWeight: "600" }}>{member.name}</td>
                    <td>{member.email}</td>
                    <td>
                      <span className={`priority-badge ${isOwner ? 'priority-high' : 'priority-low'}`}>
                        {isOwner ? "Owner" : "Member"}
                      </span>
                    </td>
                    <td>
                      {!isOwner ? (
                        <button 
                          className="remove-btn" 
                          onClick={() => handleRemoveMember(member._id)}
                        >
                          Remove
                        </button>
                      ) : (
                        <span style={{ color: "var(--text-muted)", fontSize: "13px" }}>-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="settings-card danger-zone">
        <h2>Danger Zone</h2>
        <p>
          Once you delete this workspace, all boards, tasks and member references will be removed permanently. This action cannot be reversed.
        </p>
        <button className="delete-btn" onClick={handleDeleteWorkspace}>
          Delete Workspace
        </button>
      </div>
    </div>
  );
};

export default WorkspaceSettings;