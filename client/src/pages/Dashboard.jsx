import { useCallback, useEffect, useState } from "react";
import { getWorkspaces } from "../services/api";

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const res = await getWorkspaces();

      setWorkspaces(res.data.workspaces || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

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
          <h2>0</h2>
        </div>
      </div>

      <div className="recent-workspaces">
        <h2>Recent Workspaces</h2>

        {loading ? (
          <p>Loading...</p>
        ) : workspaces.length === 0 ? (
          <p>No Workspaces Found</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Workspace</th>
                <th>Owner</th>
                <th>Members</th>
                <th>Visibility</th>
              </tr>
            </thead>

            <tbody>
              {workspaces.map((workspace) => (
                <tr key={workspace._id}>
                  <td>{workspace.name}</td>

                  <td>{workspace.owner?.name}</td>

                  <td>{workspace.members?.length}</td>

                  <td>{workspace.visibility}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;