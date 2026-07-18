import { useCallback, useEffect, useState } from "react";
import { getWorkspaces, getActivities } from "../services/api";

const ActivityLog = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState("");
  const [entityType, setEntityType] = useState("");
  const [action, setAction] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  // Load user's workspaces
  useEffect(() => {
    const fetchWorkspaces = async () => {
      try {
        const res = await getWorkspaces();
        const list = res.data.workspaces || [];
        setWorkspaces(list);

        // Pre-select workspace from sessionStorage if exists
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

  // Fetch activities on parameter change
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const params = {
        page,
        limit: 10,
      };

      if (selectedWorkspaceId) params.workspaceId = selectedWorkspaceId;
      if (entityType) params.entityType = entityType;
      if (action) params.action = action;
      if (searchQuery.trim()) params.q = searchQuery.trim();

      const res = await getActivities(params);
      setActivities(res.data.activities || []);
      setTotalPages(res.data.pages || 1);
      setTotalItems(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch activity logs:", err);
      setErrorMsg("Failed to load activity logs");
    } finally {
      setLoading(false);
    }
  }, [selectedWorkspaceId, entityType, action, searchQuery, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Reset pagination to page 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [selectedWorkspaceId, entityType, action, searchQuery]);

  const getActionColor = (act) => {
    switch (act) {
      case "created":
        return "#10b981"; // success green
      case "deleted":
      case "removed":
        return "#ef4444"; // danger red
      case "updated":
      case "moved":
        return "#f59e0b"; // warning orange
      case "invited":
      case "commented":
      default:
        return "#3b82f6"; // primary blue
    }
  };

  const getEntityIcon = (type) => {
    switch (type) {
      case "Workspace":
        return "📁";
      case "Project":
        return "💼";
      case "Board":
        return "📋";
      case "List":
        return "📊";
      case "Card":
        return "📌";
      case "Comment":
        return "💬";
      case "Invite":
        return "✉";
      default:
        return "🔔";
    }
  };

  const formatActivityTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  return (
    <div style={{ padding: "30px", width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.02em", marginBottom: "24px" }}>
        Activity Log
      </h1>

      {/* Filter Toolbar */}
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
          marginBottom: "24px"
        }}
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
          <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Category</label>
          <select 
            value={entityType} 
            onChange={(e) => setEntityType(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "13px", outline: "none", width: "160px" }}
          >
            <option value="">All Types</option>
            <option value="Workspace">Workspace</option>
            <option value="Project">Project</option>
            <option value="Board">Board</option>
            <option value="List">List Column</option>
            <option value="Card">Task Card</option>
            <option value="Comment">Comment</option>
            <option value="Invite">Invite</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Action</label>
          <select 
            value={action} 
            onChange={(e) => setAction(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "13px", outline: "none", width: "140px" }}
          >
            <option value="">All Actions</option>
            <option value="created">Created</option>
            <option value="updated">Updated</option>
            <option value="deleted">Deleted</option>
            <option value="moved">Moved</option>
            <option value="commented">Commented</option>
            <option value="invited">Invited</option>
            <option value="removed">Removed</option>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1, minWidth: "200px" }}>
          <label style={{ fontSize: "11px", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>Search Logs</label>
          <input 
            type="text" 
            placeholder="Search targets or details..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "13px", outline: "none", margin: 0 }}
          />
        </div>
      </div>

      {errorMsg && (
        <div style={{ padding: "12px 20px", backgroundColor: "var(--danger-bg)", color: "var(--danger)", borderRadius: "var(--radius-md)", border: "1px solid rgba(239, 68, 68, 0.2)", marginBottom: "24px" }}>
          ⚠ {errorMsg}
        </div>
      )}

      {/* Activities Timeline Stack */}
      <div 
        style={{ 
          backgroundColor: "var(--bg-card)", 
          border: "1px solid var(--border-color)", 
          borderRadius: "var(--radius-md)", 
          padding: "24px", 
          boxShadow: "var(--shadow-sm)",
          display: "flex",
          flexDirection: "column",
          gap: "18px"
        }}
      >
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} style={{ height: "60px", backgroundColor: "var(--bg-app)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div style={{ padding: "40px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
            No activity logs match your filter options.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", position: "relative" }}>
            {/* Timeline center line decoration */}
            <div style={{ position: "absolute", left: "28px", top: 0, bottom: 0, width: "2px", backgroundColor: "var(--border-color)" }} />

            {activities.map((act) => {
              const categoryIcon = getEntityIcon(act.entityType);
              const badgeBg = getActionColor(act.action);

              return (
                <div 
                  key={act._id} 
                  style={{ 
                    display: "flex", 
                    gap: "20px", 
                    alignItems: "flex-start", 
                    position: "relative", 
                    zIndex: 2, 
                    transition: "transform 0.15s ease" 
                  }}
                >
                  {/* Category icon pill */}
                  <div 
                    style={{ 
                      width: "56px", 
                      height: "56px", 
                      borderRadius: "50%", 
                      backgroundColor: "var(--bg-app)", 
                      border: "2px solid var(--border-color)", 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "center", 
                      fontSize: "20px", 
                      boxShadow: "var(--shadow-sm)", 
                      flexShrink: 0 
                    }}
                  >
                    {categoryIcon}
                  </div>

                  {/* Activity log text card */}
                  <div 
                    style={{ 
                      flex: 1, 
                      padding: "14px 18px", 
                      borderRadius: "var(--radius-md)", 
                      border: "1px solid var(--border-color)", 
                      backgroundColor: "var(--bg-app)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      flexWrap: "wrap"
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <div>
                        <strong style={{ color: "var(--text-main)" }}>{act.user?.name || "Workspace member"}</strong>
                        <span 
                          style={{ 
                            marginLeft: "8px", 
                            fontSize: "11px", 
                            fontWeight: "700", 
                            padding: "2px 8px", 
                            borderRadius: "4px", 
                            backgroundColor: `${badgeBg}15`, 
                            color: badgeBg, 
                            textTransform: "uppercase" 
                          }}
                        >
                          {act.action}
                        </span>
                        <span style={{ marginLeft: "8px", color: "var(--text-main)", fontWeight: "600", fontSize: "13.5px" }}>
                          {act.entityName}
                        </span>
                      </div>
                      
                      {act.details && (
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, fontStyle: "italic" }}>
                          {act.details}
                        </p>
                      )}
                    </div>

                    <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: "500" }}>
                      ⏰ {formatActivityTime(act.createdAt)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Paginated Footer */}
        {totalPages > 1 && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border-color)", paddingTop: "16px", marginTop: "10px" }}>
            <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
              Showing <strong>{activities.length}</strong> of <strong>{totalItems}</strong> entries
            </span>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                disabled={page === 1 || loading}
                onClick={() => setPage(prev => prev - 1)}
                style={{ padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: page === 1 ? "var(--bg-app)" : "var(--bg-card)", color: page === 1 ? "var(--text-muted)" : "var(--text-main)", fontWeight: "600", cursor: page === 1 ? "not-allowed" : "pointer" }}
              >
                Previous
              </button>

              <span style={{ fontSize: "13px", color: "var(--text-muted)" }}>
                Page <strong>{page}</strong> of <strong>{totalPages}</strong>
              </span>

              <button
                disabled={page === totalPages || loading}
                onClick={() => setPage(prev => prev + 1)}
                style={{ padding: "8px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: page === totalPages ? "var(--bg-app)" : "var(--bg-card)", color: page === totalPages ? "var(--text-muted)" : "var(--text-main)", fontWeight: "600", cursor: page === totalPages ? "not-allowed" : "pointer" }}
              >
                Next
              </button>
            </div>
          </div>
        )}
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
};

export default ActivityLog;
