import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkspaces } from "../services/api";

const Workspace = () => {
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWorkspace = useCallback(async () => {
    try {
      const res = await getWorkspaces();
      const workspaces = res.data.workspaces || [];

      if (workspaces.length > 0) {
        setWorkspace(workspaces[0]);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!workspace) {
    return (
      <div className="workspace">
        <h2>No Workspace Found</h2>
      </div>
    );
  }

  return (
    <div className="workspace">

      <div className="workspace-header">
        <h1>{workspace.name}</h1>

        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button className="create-board-btn">
            + Create Board
          </button>

          <button
            className="create-board-btn"
            onClick={() => navigate("/workspace-settings")}
          >
            ⚙ Workspace Settings
          </button>
        </div>
      </div>

      <div className="workspace-info">

        <div className="workspace-card">
          <h2>Workspace Name</h2>
          <p>{workspace.name}</p>
        </div>

        <div className="workspace-card">
          <h2>Description</h2>
          <p>{workspace.description || "No description available."}</p>
        </div>

        <div className="workspace-card">
          <h2>Visibility</h2>
          <p>{workspace.visibility}</p>
        </div>

      </div>

      <div className="workspace-members">

        <h2>Members</h2>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>

            {workspace.members.map((member) => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>
                  {workspace.owner._id === member._id
                    ? "Owner"
                    : "Member"}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      <div className="boards-section">

        <h2>Boards</h2>

        <div className="boards-grid">

          <div className="board-card">
            <h3>Boards will appear here</h3>
            <p>
              Create your first board to start managing
              tasks.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Workspace;