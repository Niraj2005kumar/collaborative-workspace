import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateProjectModal from "../components/CreateProjectModal";
import CreateBoardModal from "../components/CreateBoardModal";
import {
  getWorkspaces,
  getProjects,
  createWorkspace,
  createProject,
} from "../services/api";


const Workspace = () => {
  const navigate = useNavigate();

  const [workspaces, setWorkspaces] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  
  // New Workspace form state
  const [newWorkspaceData, setNewWorkspaceData] = useState({
    name: "",
    description: "",
    visibility: "private",
  });

  // Fetch Boards
  const fetchProjects = async (workspaceId) => {
    try {
      const res = await getProjects(workspaceId);
      setProjects(res.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  // Fetch Workspaces
  const fetchAllWorkspaces = useCallback(async (selectWorkspaceId = null) => {
    try {
      const res = await getWorkspaces();
      const workspacesList = res.data.workspaces || [];
      setWorkspaces(workspacesList);

      if (workspacesList.length > 0) {
        // If a specific workspace was selected/created, pick that. Otherwise default to first.
        let currentWorkspace = workspacesList[0];
        if (selectWorkspaceId) {
          const found = workspacesList.find(w => w._id === selectWorkspaceId);
          if (found) currentWorkspace = found;
        }
        
        // Save selected workspace to state and session
        setWorkspace(currentWorkspace);
        sessionStorage.setItem("selectedWorkspaceId", currentWorkspace._id);
        await fetchProjects(currentWorkspace._id);
      } else {
        setWorkspace(null);
        setProjects([]);
      }
    } catch (error) {
      console.error("Error loading workspaces:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedId = sessionStorage.getItem("selectedWorkspaceId");
    fetchAllWorkspaces(savedId);
  }, [fetchAllWorkspaces]);

  // Handle Workspace Switch
  const handleWorkspaceChange = async (e) => {
    const wsId = e.target.value;
    const selected = workspaces.find((w) => w._id === wsId);
    if (selected) {
      setWorkspace(selected);
      sessionStorage.setItem("selectedWorkspaceId", selected._id);
      setLoading(true);
      await fetchProjects(selected._id);
      setLoading(false);
    }
  };

  // Create Project
  const handleCreateProject = async ({ name, description }) => {
    try {
      await createProject({
        name,
        description,
        workspace: workspace._id,
      });
      await fetchProjects(workspace._id);
      setShowProjectModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create project");
    }
  };

  // Create Workspace
  const handleCreateWorkspaceSubmit = async (e) => {
    e.preventDefault();
    if (!newWorkspaceData.name.trim()) {
      alert("Workspace name is required");
      return;
    }
    try {
      setLoading(true);
      const res = await createWorkspace(newWorkspaceData);
      const newWs = res.data.workspace;
      
      // Reset form
      setNewWorkspaceData({ name: "", description: "", visibility: "private" });
      setShowWorkspaceModal(false);
      
      // Refresh and select the newly created workspace
      await fetchAllWorkspaces(newWs._id);
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to create workspace");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px" }}>
        <h2 style={{ color: "var(--text-muted)" }}>Loading Workspace...</h2>
      </div>
    );
  }

  return (
    <div className="workspace">
      {/* Workspace Header / Selection */}
      <div className="workspace-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {workspace ? (
            <>
              <h1>{workspace.name}</h1>
              {workspaces.length > 1 && (
                <select 
                  value={workspace._id} 
                  onChange={handleWorkspaceChange}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--bg-card)",
                    color: "var(--text-main)",
                    fontSize: "14px",
                    fontWeight: "500",
                    outline: "none"
                  }}
                >
                  {workspaces.map(w => (
                    <option key={w._id} value={w._id}>{w.name}</option>
                  ))}
                </select>
              )}
            </>
          ) : (
            <h1>No Workspace Found</h1>
          )}
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="create-board-btn"
            style={{ backgroundColor: "#10b981" }}
            onClick={() => setShowWorkspaceModal(true)}
          >
            + Create Workspace
          </button>
          
          {workspace && (
            <>
              <button
                className="create-board-btn"
                onClick={() => setShowProjectModal(true)}
              >
                + Create Project
              </button>

              <button
                className="create-board-btn"
                style={{ 
                  backgroundColor: "var(--bg-app)", 
                  color: "var(--text-main)", 
                  border: "1px solid var(--border-color)" 
                }}
                onClick={() => navigate("/workspace-settings")}
              >
                ⚙ Settings
              </button>
            </>
          )}
        </div>
      </div>

      {!workspace ? (
        <div style={{ 
          textAlign: "center", 
          padding: "80px 20px", 
          backgroundColor: "var(--bg-card)", 
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--border-color)"
        }}>
          <h2 style={{ marginBottom: "16px" }}>You are not in any workspace yet</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
            Create a workspace to start managing your projects, boards, and tasks.
          </p>
          <button
            className="create-board-btn"
            style={{ padding: "12px 24px" }}
            onClick={() => setShowWorkspaceModal(true)}
          >
            Create Your First Workspace
          </button>
        </div>
      ) : (
        <>
          {/* Workspace Info */}
          <div className="workspace-info">
            <div className="workspace-card">
              <h2>Workspace Name</h2>
              <p>{workspace.name}</p>
            </div>

            <div className="workspace-card">
              <h2>Description</h2>
              <p>{workspace.description || "No description available"}</p>
            </div>

            <div className="workspace-card">
              <h2>Visibility</h2>
              <p style={{ textTransform: "capitalize" }}>{workspace.visibility}</p>
            </div>
          </div>

          {/* Projects */}
          <div className="boards-section">
            <h2>Projects</h2>
            <div className="boards-grid">
              {projects.length === 0 ? (
                <div
                  className="board-card"
                  style={{
                    borderStyle: "dashed",
                    borderLeftWidth: "1px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "32px",
                    cursor: "default"
                  }}
                >
                  <h3 style={{ color: "var(--text-muted)" }}>No Projects Available</h3>
                  <button
                    className="add-card-btn-inline"
                    style={{ marginTop: "8px" }}
                    onClick={() => setShowProjectModal(true)}
                  >
                    + Create Project
                  </button>
                </div>
              ) : (
                projects.map((project) => (
                  <div
                    key={project._id}
                    className="board-card"
                    onClick={() => navigate(`/projects/${project._id}`)}
                  >
                    <h3>{project.name}</h3>
                    <p>{project.description || "Open Project"}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Members */}
          <div className="workspace-members">
            <h2>Members</h2>
            <div style={{ overflowX: "auto" }}>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {workspace.members?.map((member) => (
                    <tr key={member._id}>
                      <td style={{ fontWeight: "600" }}>{member.name}</td>
                      <td>{member.email}</td>
                      <td>
                        <span className={`priority-badge ${workspace.owner?._id === member._id ? 'priority-high' : 'priority-low'}`}>
                          {workspace.owner?._id === member._id ? "Owner" : "Member"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onCreate={handleCreateProject}
      />

      {/* Create Workspace Modal */}
      {showWorkspaceModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create Workspace</h2>
            <form onSubmit={handleCreateWorkspaceSubmit}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Workspace Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Engineering Team"
                value={newWorkspaceData.name}
                onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, name: e.target.value }))}
                required
              />

              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Description
              </label>
              <textarea
                placeholder="What is this workspace about?"
                value={newWorkspaceData.description}
                onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, description: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "10px 14px",
                  border: "1px solid var(--border-color)",
                  borderRadius: "var(--radius-sm)",
                  backgroundColor: "var(--bg-app)",
                  color: "var(--text-main)",
                  fontSize: "14px",
                  minHeight: "80px",
                  marginBottom: "16px",
                  outline: "none"
                }}
              />

              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Visibility
              </label>
              <select
                value={newWorkspaceData.visibility}
                onChange={(e) => setNewWorkspaceData(prev => ({ ...prev, visibility: e.target.value }))}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
              </select>

              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowWorkspaceModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="create-btn">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workspace;