import { useCallback, useEffect, useState } from "react";
import { getWorkspaces, getProjects, getAnalyticsTasks } from "../services/api";

const Analytics = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load user's workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await getWorkspaces();
        const list = res.data.workspaces || [];
        setWorkspaces(list);

        const cachedWsId = sessionStorage.getItem("selectedWorkspaceId");
        if (cachedWsId && list.some(w => w._id === cachedWsId)) {
          setSelectedWorkspaceId(cachedWsId);
        } else if (list.length > 0) {
          setSelectedWorkspaceId(list[0]._id);
        }
      } catch (err) {
        console.error("Failed to load workspaces:", err);
      }
    };
    fetchWorkspaces();
  }, []);

  // Load projects based on selected workspace
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedWorkspaceId) {
        setProjects([]);
        setSelectedProjectId("");
        return;
      }
      try {
        const res = await getProjects(selectedWorkspaceId);
        const list = res.data.projects || [];
        setProjects(list);
        setSelectedProjectId(""); // Reset selected project
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    };
    fetchProjects();
  }, [selectedWorkspaceId]);

  // Fetch formatted analytics tasks list
  const fetchTasksReport = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const params = {};
      if (selectedWorkspaceId) params.workspaceId = selectedWorkspaceId;
      if (selectedProjectId) params.projectId = selectedProjectId;

      const res = await getAnalyticsTasks(params);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Failed to load analytics report:", err);
      setErrorMsg("Failed to load analytics tasks data");
    } finally {
      setLoading(false);
    }
  }, [selectedWorkspaceId, selectedProjectId]);

  useEffect(() => {
    fetchTasksReport();
  }, [fetchTasksReport]);

  // Generate distributions for charts
  const priorityBreakdown = tasks.reduce(
    (acc, t) => {
      if (t.priority === "High") acc.High += 1;
      else if (t.priority === "Medium") acc.Medium += 1;
      else acc.Low += 1;
      return acc;
    },
    { High: 0, Medium: 0, Low: 0 }
  );

  const assigneeBreakdown = tasks.reduce((acc, t) => {
    const name = t.assigneeName || "Unassigned";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const columnBreakdown = tasks.reduce((acc, t) => {
    const colName = t.columnName || "Unknown";
    acc[colName] = (acc[colName] || 0) + 1;
    return acc;
  }, {});

  // Export tasks as CSV
  const handleExportCSV = () => {
    if (tasks.length === 0) {
      alert("No data available to export");
      return;
    }

    const headers = [
      "Task ID",
      "Title",
      "Description",
      "Priority",
      "Due Date",
      "Labels",
      "Assignee",
      "Assignee Email",
      "Column Status",
      "Board Name",
      "Project Name",
    ];

    const rows = tasks.map((t) => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      `"${t.description.replace(/"/g, '""')}"`,
      t.priority,
      t.dueDate,
      `"${t.labels}"`,
      `"${t.assigneeName}"`,
      t.assigneeEmail,
      `"${t.columnName}"`,
      `"${t.boardName}"`,
      `"${t.projectName}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tasks_report_${selectedWorkspaceId || "all"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export PDF using print
  const handleExportPDF = () => {
    window.print();
  };

  const getPriorityColor = (p) => {
    if (p === "High") return "var(--danger)";
    if (p === "Medium") return "var(--warning)";
    return "var(--success)";
  };

  return (
    <div style={{ padding: "30px", width: "100%", maxWidth: "1600px", margin: "0 auto" }} className="analytics-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }} className="no-print">
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.02em", margin: 0 }}>
          Analytics & Reports
        </h1>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleExportCSV}
            style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-main)", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            📥 Export CSV
          </button>

          <button
            onClick={handleExportPDF}
            style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
          >
            📄 Print / Save PDF
          </button>
        </div>
      </div>

      {/* Print Title Header (Visible only when printing) */}
      <div className="print-only-header" style={{ display: "none", marginBottom: "28px", borderBottom: "2px solid #000000", paddingBottom: "12px" }}>
        <h1 style={{ margin: "0 0 6px 0", fontSize: "24px", color: "#000" }}>Collaborative Workspace Task Report</h1>
        <p style={{ margin: 0, fontSize: "13px", color: "#666" }}>
          Generated on: {new Date().toLocaleDateString()} • Workspace ID: {selectedWorkspaceId || "All Workspaces"}
        </p>
      </div>

      {/* Filters Toolbar */}
      <div 
        style={{ 
          display: "flex", 
          flexWrap: "wrap", 
          gap: "16px", 
          alignItems: "center", 
          backgroundColor: "var(--bg-card)", 
          padding: "16px 20px", 
          borderRadius: "var(--radius-md)", 
          border: "1px solid var(--border-color)",
          marginBottom: "28px"
        }}
        className="no-print"
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Workspace</label>
          <select 
            value={selectedWorkspaceId} 
            onChange={(e) => {
              setSelectedWorkspaceId(e.target.value);
              sessionStorage.setItem("selectedWorkspaceId", e.target.value);
            }}
            style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "13px", outline: "none", width: "200px" }}
          >
            <option value="">All Workspaces</option>
            {workspaces.map((ws) => (
              <option key={ws._id} value={ws._id}>{ws.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Project</label>
          <select 
            value={selectedProjectId} 
            onChange={(e) => setSelectedProjectId(e.target.value)}
            disabled={!selectedWorkspaceId}
            style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: selectedWorkspaceId ? "var(--bg-app)" : "var(--border-color)30", color: "var(--text-main)", fontSize: "13px", outline: "none", width: "200px", cursor: selectedWorkspaceId ? "pointer" : "not-allowed" }}
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: "12px 20px", backgroundColor: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: "24px" }}>
          ⚠ {errorMsg}
        </div>
      )}

      {loading ? (
        <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Compiling reports and analysis...</p>
        </div>
      ) : (
        <>
          {/* Charts & Distributions */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: "24px", marginBottom: "28px" }} className="no-print">
            {/* Priorities */}
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "14.5px", fontWeight: "600", color: "var(--text-main)", marginBottom: "16px" }}>Tasks by Priority</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {["High", "Medium", "Low"].map((pr) => {
                  const val = priorityBreakdown[pr] || 0;
                  const total = tasks.length || 1;
                  const pct = `${Math.round((val / total) * 100)}%`;
                  return (
                    <div key={pr}>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                        <span style={{ fontWeight: "600", color: "var(--text-main)" }}>{pr}</span>
                        <span style={{ color: "var(--text-muted)" }}>{val} ({pct})</span>
                      </div>
                      <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-app)", borderRadius: "4px" }}>
                        <div style={{ width: pct, height: "100%", backgroundColor: getPriorityColor(pr), borderRadius: "4px" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Column density */}
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "14.5px", fontWeight: "600", color: "var(--text-main)", marginBottom: "16px" }}>Tasks by Column</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "160px", overflowY: "auto" }}>
                {Object.keys(columnBreakdown).length === 0 ? (
                  <p style={{ fontStyle: "italic", fontSize: "12px", color: "var(--text-muted)" }}>No tasks mapped.</p>
                ) : (
                  Object.entries(columnBreakdown).map(([col, val]) => {
                    const total = tasks.length || 1;
                    const pct = `${Math.round((val / total) * 100)}%`;
                    return (
                      <div key={col}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "600", color: "var(--text-main)" }}>{col}</span>
                          <span style={{ color: "var(--text-muted)" }}>{val} ({pct})</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-app)", borderRadius: "4px" }}>
                          <div style={{ width: pct, height: "100%", backgroundColor: "var(--primary)", borderRadius: "4px" }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Assignee distribution */}
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }}>
              <h3 style={{ fontSize: "14.5px", fontWeight: "600", color: "var(--text-main)", marginBottom: "16px" }}>Task Allocation by Assignee</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "160px", overflowY: "auto" }}>
                {Object.keys(assigneeBreakdown).length === 0 ? (
                  <p style={{ fontStyle: "italic", fontSize: "12px", color: "var(--text-muted)" }}>No assignees found.</p>
                ) : (
                  Object.entries(assigneeBreakdown).map(([name, val]) => {
                    const total = tasks.length || 1;
                    const pct = `${Math.round((val / total) * 100)}%`;
                    return (
                      <div key={name}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
                          <span style={{ fontWeight: "600", color: "var(--text-main)" }}>{name}</span>
                          <span style={{ color: "var(--text-muted)" }}>{val} ({pct})</span>
                        </div>
                        <div style={{ width: "100%", height: "8px", backgroundColor: "var(--bg-app)", borderRadius: "4px" }}>
                          <div style={{ width: pct, height: "100%", backgroundColor: "#8b5cf6", borderRadius: "4px" }} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Tabular Reports Grid */}
          <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-md)", padding: "24px", boxShadow: "var(--shadow-sm)" }} className="print-report-container">
            <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-main)", marginBottom: "16px" }} className="no-print">
              Task Details Data Table ({tasks.length} tasks)
            </h2>

            {tasks.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "13.5px", margin: 0 }}>
                No task records matches the selection filters.
              </p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table style={{ borderCollapse: "collapse", width: "100%" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid var(--border-color)", paddingBottom: "10px" }}>
                      <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: "700", color: "var(--text-muted)" }}>Title</th>
                      <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: "700", color: "var(--text-muted)" }}>Project / Board</th>
                      <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: "700", color: "var(--text-muted)" }}>Priority</th>
                      <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: "700", color: "var(--text-muted)" }}>Column Status</th>
                      <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: "700", color: "var(--text-muted)" }}>Assignee</th>
                      <th style={{ textAlign: "left", padding: "10px", fontSize: "13px", fontWeight: "700", color: "var(--text-muted)" }}>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task) => (
                      <tr key={task.id} style={{ borderBottom: "1px solid var(--border-color)", transition: "background-color 0.15s ease" }} className="table-row-hover">
                        <td style={{ padding: "12px 10px", fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>
                          {task.title}
                          {task.labels && (
                            <div style={{ marginTop: "4px" }}>
                              {task.labels.split(", ").map((l) => l && (
                                <span key={l} style={{ fontSize: "9px", textTransform: "uppercase", fontWeight: "700", padding: "1px 5px", borderRadius: "3px", backgroundColor: "var(--border-color)", color: "var(--text-muted)", marginRight: "4px" }}>
                                  {l}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ padding: "12px 10px", fontSize: "12.5px", color: "var(--text-muted)" }}>
                          {task.projectName} / <strong style={{ color: "var(--text-main)" }}>{task.boardName}</strong>
                        </td>
                        <td style={{ padding: "12px 10px", fontSize: "12.5px" }}>
                          <span style={{ fontWeight: "700", color: getPriorityColor(task.priority) }}>
                            {task.priority}
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", fontSize: "12.5px", color: "var(--text-main)", fontWeight: "500" }}>
                          {task.columnName}
                        </td>
                        <td style={{ padding: "12px 10px", fontSize: "12.5px", color: "var(--text-muted)" }}>
                          👤 {task.assigneeName}
                        </td>
                        <td style={{ padding: "12px 10px", fontSize: "12.5px", color: "var(--text-muted)" }}>
                          {task.dueDate}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* Global CSS for analytics tables & Print Style sheet */}
      <style>{`
        .table-row-hover:hover {
          background-color: var(--border-color)15;
        }
        @media print {
          body {
            background-color: #ffffff !important;
            color: #000000 !important;
          }
          .sidebar, .navbar, .no-print, .dashboard-title {
            display: none !important;
          }
          .print-only-header {
            display: block !important;
          }
          .main-content {
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
          }
          .print-report-container {
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            background-color: transparent !important;
          }
          table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          th {
            color: #333 !important;
            border-bottom: 2px solid #000 !important;
          }
          td {
            color: #000 !important;
            border-bottom: 1px solid #ccc !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Analytics;
