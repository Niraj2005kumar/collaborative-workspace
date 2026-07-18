import { useCallback, useEffect, useState } from "react";
import { getWorkspaces, getDashboardStats } from "../services/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      // Fetch Workspaces list for recent workspaces table
      const wsRes = await getWorkspaces();
      setWorkspaces(wsRes.data.workspaces || []);

      // Fetch dashboard aggregated stats
      const statsRes = await getDashboardStats();
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error("Error loading dashboard stats:", err);
      setErrorMsg("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div style={{ padding: "30px", width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ width: "250px", height: "36px", backgroundColor: "var(--border-color)", borderRadius: "var(--radius-sm)", marginBottom: "24px", animation: "pulse 1.5s infinite" }} />

        <div className="dashboard-cards" style={{ marginBottom: "28px" }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <div key={n} className="card" style={{ height: "100px", animation: "pulse 1.5s infinite", backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)" }}>
              <div style={{ width: "50%", height: "14px", backgroundColor: "var(--border-color)", borderRadius: "4px", marginBottom: "12px" }} />
              <div style={{ width: "30%", height: "28px", backgroundColor: "var(--border-color)", borderRadius: "4px" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "28px" }}>
          <div style={{ height: "200px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", animation: "pulse 1.5s infinite" }} />
          <div style={{ height: "200px", backgroundColor: "var(--bg-card)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-color)", animation: "pulse 1.5s infinite" }} />
        </div>
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.6; }
            50% { opacity: 0.3; }
            100% { opacity: 0.6; }
          }
        `}</style>
      </div>
    );
  }

  const priorityBreakdown = stats?.priorityStats || { High: 0, Medium: 0, Low: 0 };
  const totalTasks = stats?.cardCount || 0;

  // Visual bar widths
  const maxPriorityCount = Math.max(priorityBreakdown.High, priorityBreakdown.Medium, priorityBreakdown.Low, 1);
  const highWidth = `${Math.round((priorityBreakdown.High / maxPriorityCount) * 100)}%`;
  const mediumWidth = `${Math.round((priorityBreakdown.Medium / maxPriorityCount) * 100)}%`;
  const lowWidth = `${Math.round((priorityBreakdown.Low / maxPriorityCount) * 100)}%`;

  return (
    <div className="dashboard" style={{ width: "100%" }}>
      <h1 className="dashboard-title" style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: "24px" }}>
        Dashboard
      </h1>

      {errorMsg && (
        <div style={{ padding: "12px 20px", backgroundColor: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: "24px" }}>
          ⚠ {errorMsg}
        </div>
      )}

      {/* Metrics Grid */}
      <div className="dashboard-cards" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
        <div className="card" style={{ borderLeft: "4px solid #3b82f6" }}>
          <h3 style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Workspaces</h3>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-main)", margin: "4px 0 0" }}>{stats?.workspaceCount || 0}</h2>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #8b5cf6" }}>
          <h3 style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Projects</h3>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-main)", margin: "4px 0 0" }}>{stats?.projectCount || 0}</h2>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #ec4899" }}>
          <h3 style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Boards</h3>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-main)", margin: "4px 0 0" }}>{stats?.boardCount || 0}</h2>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #f59e0b" }}>
          <h3 style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>List Columns</h3>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-main)", margin: "4px 0 0" }}>{stats?.listCount || 0}</h2>
        </div>

        <div className="card" style={{ borderLeft: "4px solid #10b981" }}>
          <h3 style={{ fontSize: "11px", color: "var(--text-muted)", textTransform: "uppercase", fontWeight: "700", letterSpacing: "0.05em" }}>Tasks</h3>
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "var(--text-main)", margin: "4px 0 0" }}>{totalTasks}</h2>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "24px", marginBottom: "32px" }}>
        {/* Task Completion Progress Section */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-main)", marginBottom: "20px" }}>Task Progress</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", justifyContent: "center", height: "80%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", fontWeight: "600" }}>
              <span style={{ color: "var(--text-muted)" }}>Completion Rate</span>
              <span style={{ color: "var(--primary)" }}>{stats?.completionRate || 0}%</span>
            </div>
            
            <div style={{ width: "100%", height: "16px", backgroundColor: "var(--bg-app)", borderRadius: "8px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
              <div 
                style={{ 
                  width: `${stats?.completionRate || 0}%`, 
                  height: "100%", 
                  background: "linear-gradient(90deg, var(--primary) 0%, #8b5cf6 100%)", 
                  borderRadius: "8px",
                  transition: "width 0.5s ease" 
                }} 
              />
            </div>

            <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0 }}>
              Completed <strong>{stats?.completedCards || 0}</strong> of <strong>{totalTasks}</strong> total tasks assigned inside your workspace columns.
            </p>
          </div>
        </div>

        {/* Priority Breakdown Distribution Section */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
          <h3 style={{ fontSize: "15px", fontWeight: "600", color: "var(--text-main)", marginBottom: "20px" }}>Task Priorities</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* High priority */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>High Priority</span>
                <span style={{ color: "var(--danger)", fontWeight: "600" }}>{priorityBreakdown.High}</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-app)", borderRadius: "4px" }}>
                <div style={{ width: highWidth, height: "100%", backgroundColor: "var(--danger)", borderRadius: "4px", transition: "width 0.5s ease" }} />
              </div>
            </div>

            {/* Medium priority */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Medium Priority</span>
                <span style={{ color: "var(--warning)", fontWeight: "600" }}>{priorityBreakdown.Medium}</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-app)", borderRadius: "4px" }}>
                <div style={{ width: mediumWidth, height: "100%", backgroundColor: "var(--warning)", borderRadius: "4px", transition: "width 0.5s ease" }} />
              </div>
            </div>

            {/* Low priority */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px", marginBottom: "4px" }}>
                <span style={{ fontWeight: "600", color: "var(--text-main)" }}>Low Priority</span>
                <span style={{ color: "var(--success)", fontWeight: "600" }}>{priorityBreakdown.Low}</span>
              </div>
              <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-app)", borderRadius: "4px" }}>
                <div style={{ width: lowWidth, height: "100%", backgroundColor: "var(--success)", borderRadius: "4px", transition: "width 0.5s ease" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workspaces list table */}
      <div className="recent-workspaces" style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-main)", marginBottom: "16px" }}>Recent Workspaces</h2>

        {workspaces.length === 0 ? (
          <p style={{ color: "var(--text-muted)", fontSize: "13.5px", margin: 0 }}>
            No workspaces found. Create a workspace to start managing your projects.
          </p>
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
                    <td style={{ fontWeight: "600", color: "var(--text-main)" }}>{workspace.name}</td>
                    <td style={{ color: "var(--text-muted)" }}>{workspace.owner?.name || "Unknown"}</td>
                    <td style={{ color: "var(--text-muted)" }}>{workspace.members?.length || 0} members</td>
                    <td>
                      <span className={`priority-badge ${workspace.visibility === 'public' ? 'priority-low' : 'priority-medium'}`}>
                        {workspace.visibility}
                      </span>
                    </td>
                    <td>
                      <Link 
                        to="/workspace" 
                        onClick={() => sessionStorage.setItem("selectedWorkspaceId", workspace._id)}
                        style={{ 
                          color: "var(--primary)", 
                          fontWeight: "600",
                          fontSize: "13px",
                          textDecoration: "none"
                        }}
                      >
                        Open Workspace →
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