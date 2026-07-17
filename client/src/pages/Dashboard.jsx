import { useCallback, useEffect, useState } from "react";
import { getWorkspaces, getBoards } from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [totalBoards, setTotalBoards] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchWorkspacesAndBoards = useCallback(async () => {
    try {
      const res = await getWorkspaces();
      const workspacesList = res.data.workspaces || [];
      setWorkspaces(workspacesList);

      let boardsCount = 0;
      for (const ws of workspacesList) {
        try {
          const boardsRes = await getBoards(ws._id);
          boardsCount += (boardsRes.data.boards || []).length;
        } catch (err) {
          console.error("Failed to load boards for workspace:", ws._id, err);
        }
      }
      setTotalBoards(boardsCount);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspacesAndBoards();
  }, [fetchWorkspacesAndBoards]);

  const totalMembers = workspaces.reduce(
    (total, workspace) => total + (workspace.members?.length || 0),
    0
  );

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Workspaces</h3>
          <h2>{workspaces.length}</h2>
        </div>

        <div className="card">
          <h3>Total Members</h3>
          <h2>{totalMembers}</h2>
        </div>

        <div className="card">
          <h3>Pending Invitations</h3>
          <h2>0</h2>
        </div>

        <div className="card">
          <h3>Active Boards</h3>
          <h2>{totalBoards}</h2>
        </div>
      </div>

      <div className="recent-workspaces">
        <h2>Recent Workspaces</h2>

        {loading ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            Loading workspaces...</p>
        ) : workspaces.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            
            No workspaces found. Go to Workspaces page to create one.</p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr>
                  <th>Workspace Name</th>
                  <th>Owner</th>
                  <th>Members Count</th>
                  <th>Visibility</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {workspaces.map((workspace) => (
                  <tr key={workspace._id}>
                    <td style={{ fontWeight: "600" }}>{workspace.name}</td>
                    <td>{workspace.owner?.name || "Unknown"}</td>
                    <td>{workspace.members?.length || 0} members</td>
                    <td>
                      <span className={`priority-badge ${workspace.visibility === 'public' ? 'priority-low' : 'priority-medium'}`}>
                        {workspace.visibility}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to="/workspace" 
                        style={{ 
                          color: "var(--primary)", 
                          fontWeight: "600",
                          fontSize: "13px"
                        }}
                      >
                        Open Workspace
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;