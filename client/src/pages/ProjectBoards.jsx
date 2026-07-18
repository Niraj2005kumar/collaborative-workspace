import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProject,
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from "../services/api";
import CreateBoardModal from "../components/CreateBoardModal";

const ProjectBoards = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Fetch Project Details and Boards
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const projectRes = await getProject(projectId);
      setProject(projectRes.data.project);

      const boardsRes = await getBoards(projectId);
      setBoards(boardsRes.data.boards || []);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to load project board data");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Create Board
  const handleCreateBoard = async (title) => {
    if (!project) return;
    const workspaceId = project.workspace?._id || project.workspace;

    try {
      setErrorMsg(null);
      await createBoard({
        title,
        workspace: workspaceId,
        project: projectId,
      });
      fetchData();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to create board");
    }
  };

  // Rename Board
  const handleRenameBoard = async (board) => {
    const title = prompt("Rename Board To:", board.title);
    if (!title || title.trim() === board.title) return;

    try {
      setErrorMsg(null);
      await updateBoard(board._id, { title: title.trim() });
      fetchData();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to rename board");
    }
  };

  // Delete Board
  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board? This action cannot be undone.")) return;

    try {
      setErrorMsg(null);
      await deleteBoard(boardId);
      fetchData();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || "Failed to delete board");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "30px", width: "100%", maxWidth: "1600px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <div style={{ width: "200px", height: "32px", backgroundColor: "var(--border-color)", borderRadius: "var(--radius-sm)", animation: "pulse 1.5s infinite" }} />
            <div style={{ width: "350px", height: "16px", backgroundColor: "var(--border-color)", borderRadius: "var(--radius-sm)", marginTop: "8px", animation: "pulse 1.5s infinite" }} />
          </div>
          <div style={{ width: "120px", height: "40px", backgroundColor: "var(--border-color)", borderRadius: "var(--radius-sm)", animation: "pulse 1.5s infinite" }} />
        </div>
        <div className="boards-grid">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              style={{
                height: "150px",
                backgroundColor: "var(--bg-card)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ width: "60%", height: "18px", backgroundColor: "var(--border-color)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              <div style={{ width: "40%", height: "14px", backgroundColor: "var(--border-color)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              <div style={{ marginTop: "auto", display: "flex", gap: "10px" }}>
                <div style={{ width: "60px", height: "24px", backgroundColor: "var(--border-color)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
                <div style={{ width: "60px", height: "24px", backgroundColor: "var(--border-color)", borderRadius: "4px", animation: "pulse 1.5s infinite" }} />
              </div>
            </div>
          ))}
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

  return (
    <div style={{ width: "100%", padding: "10px 0" }}>
      {/* Header */}
      <div className="board-header" style={{ marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "700", color: "var(--text-main)", letterSpacing: "-0.02em" }}>
            {project?.name || "Project Boards"}
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "14px", marginTop: "4px" }}>
            {project?.description || "Manage boards in this project"}
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <button
            className="create-board-btn"
            onClick={() => setShowCreateModal(true)}
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              border: "none",
              backgroundColor: "var(--primary)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.15s ease",
            }}
          >
            + Create Board
          </button>
          <button
            className="create-board-btn"
            style={{
              padding: "10px 18px",
              borderRadius: "var(--radius-md)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-main)",
              border: "1px solid var(--border-color)",
              fontSize: "14px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.15s ease",
            }}
            onClick={() => navigate("/workspace")}
          >
            Back to Workspace
          </button>
        </div>
      </div>

      {/* Error Alert Bar */}
      {errorMsg && (
        <div
          style={{
            padding: "12px 20px",
            backgroundColor: "var(--danger-bg)",
            color: "var(--danger)",
            borderRadius: "var(--radius-md)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            marginBottom: "24px",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>⚠ {errorMsg}</span>
          <button
            onClick={() => setErrorMsg(null)}
            style={{
              background: "none",
              border: "none",
              color: "var(--danger)",
              fontWeight: "700",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Grid of Boards */}
      <div className="boards-grid">
        {boards.length === 0 ? (
          <div
            className="board-card"
            style={{
              borderStyle: "dashed",
              borderWidth: "2px",
              borderColor: "var(--border-color)",
              borderLeftColor: "var(--border-color)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "64px 32px",
              cursor: "default",
              gridColumn: "1 / -1",
              backgroundColor: "var(--bg-card)",
              borderRadius: "var(--radius-lg)",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>📋</div>
            <h3 style={{ color: "var(--text-main)", fontWeight: "600", marginBottom: "8px" }}>
              No Kanban Boards Found
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "20px", maxWidth: "340px" }}>
              Kanban boards let you organize your project tasks in columns (To Do, In Progress, Done). Create one to begin.
            </p>
            <button
              className="create-board-btn"
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              Create Your First Board
            </button>
          </div>
        ) : (
          boards.map((board, index) => {
            // Curated slate, purple, blue gradient accents
            const accentColors = [
              "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
              "linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)",
              "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
              "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            ];
            const borderAccent = accentColors[index % accentColors.length];

            return (
              <div
                key={board._id}
                className="board-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  minHeight: "150px",
                  backgroundColor: "var(--bg-card)",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--border-color)",
                  boxShadow: "var(--shadow-sm)",
                  padding: "20px",
                  cursor: "pointer",
                  transition: "transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), border-color 0.2s ease",
                  position: "relative",
                  overflow: "hidden",
                }}
                onClick={() => navigate(`/board/${board._id}`)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-4px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-lg)";
                  e.currentTarget.style.borderColor = "var(--primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                  e.currentTarget.style.borderColor = "var(--border-color)";
                }}
              >
                {/* Accent Top Strip */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "4px", background: borderAccent }} />

                <div style={{ marginTop: "4px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text-main)" }}>
                    {board.title}
                  </h3>
                  <p style={{ fontSize: "12.5px", color: "var(--text-muted)", marginTop: "6px" }}>
                    View task boards, assignees, and progress.
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    marginTop: "16px",
                  }}
                  onClick={(e) => e.stopPropagation()} // Prevent navigation when clicking management buttons
                >
                  <button
                    className="add-card-btn-inline"
                    style={{
                      fontSize: "12px",
                      padding: "5px 10px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--bg-app)",
                      border: "1px solid var(--border-color)",
                      color: "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => handleRenameBoard(board)}
                    onMouseEnter={(e) => {
                      e.target.style.color = "var(--primary)";
                      e.target.style.borderColor = "var(--primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = "var(--text-muted)";
                      e.target.style.borderColor = "var(--border-color)";
                    }}
                  >
                    ✏ Rename
                  </button>
                  <button
                    className="list-delete-btn"
                    style={{
                      fontSize: "12px",
                      padding: "5px 10px",
                      borderRadius: "var(--radius-sm)",
                      backgroundColor: "var(--danger-bg)",
                      border: "1px solid rgba(239, 68, 68, 0.1)",
                      color: "var(--danger)",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onClick={() => handleDeleteBoard(board._id)}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "var(--danger)";
                      e.target.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "var(--danger-bg)";
                      e.target.style.color = "var(--danger)";
                    }}
                  >
                    🗑 Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Create Board Modal */}
      <CreateBoardModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateBoard}
      />
    </div>
  );
};

export default ProjectBoards;
