import { useEffect, useState } from "react";
import {
  updateCard,
  deleteCard,
  getComments,
  createComment,
  deleteComment,
  updateComment,
} from "../services/api";
import { getSocket } from "../services/socket";
import { useAuth } from "../context/AuthContext";

const AVAILABLE_LABELS = [
  { name: "Feature", color: "#10b981" },
  { name: "Bug", color: "#ef4444" },
  { name: "Design", color: "#f59e0b" },
  { name: "Task", color: "#3b82f6" },
];

const Card = ({ card, listId, workspaceMembers, triggerRefresh }) => {
  const { user: currentUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Edit card form state
  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [priority, setPriority] = useState(card.priority || "Medium");
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.split("T")[0] : "");
  const [assigneeId, setAssigneeId] = useState(card.assignee?._id || "");
  const [selectedLabels, setSelectedLabels] = useState(card.labels || []);
  const [saving, setSaving] = useState(false);

  // Edit comment state
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    if (showModal) {
      setTitle(card.title || "");
      setDescription(card.description || "");
      setPriority(card.priority || "Medium");
      setDueDate(card.dueDate ? card.dueDate.split("T")[0] : "");
      setAssigneeId(card.assignee?._id || "");
      setSelectedLabels(card.labels || []);
    }
  }, [showModal, card]);

  useEffect(() => {
    if (!showModal || !card?._id) return;

    const socket = getSocket();

    if (!socket) return;

    socket.emit("joinCard", card._id);

    const handleCommentCreated = (comment) => {
      if (!comment) return;

      const commentCardId = comment.card?._id || comment.card;
      if (commentCardId !== card._id) return;

      setComments((prev) => {
        if (prev.some((existingComment) => existingComment._id === comment._id)) {
          return prev;
        }

        return [comment, ...prev];
      });
    };

    const handleCommentUpdated = (updatedComment) => {
      if (!updatedComment) return;

      const commentCardId = updatedComment.card?._id || updatedComment.card;
      if (commentCardId !== card._id) return;

      setComments((prev) =>
        prev.map((existingComment) =>
          existingComment._id === updatedComment._id ? updatedComment : existingComment
        )
      );
    };

    const handleCommentDeleted = ({ commentId }) => {
      if (!commentId) return;

      setComments((prev) => prev.filter((existingComment) => existingComment._id !== commentId));
    };

    socket.on("commentCreated", handleCommentCreated);
    socket.on("commentUpdated", handleCommentUpdated);
    socket.on("commentDeleted", handleCommentDeleted);

    return () => {
      socket.emit("leaveCard", card._id);
      socket.off("commentCreated", handleCommentCreated);
      socket.off("commentUpdated", handleCommentUpdated);
      socket.off("commentDeleted", handleCommentDeleted);
    };
  }, [showModal, card._id]);

  // Handle Drag Start
  const handleDragStart = (e) => {
    e.dataTransfer.setData("cardId", card._id);
    e.dataTransfer.setData("sourceListId", listId);
    e.target.classList.add("dragging");
    e.stopPropagation();
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const getPriorityClass = (pr) => {
    switch (pr) {
      case "High":
        return "priority-high";
      case "Medium":
        return "priority-medium";
      case "Low":
        return "priority-low";
      default:
        return "";
    }
  };

  // Open Modal and load comments
  const handleOpenModal = async () => {
    setShowModal(true);
    setLoadingComments(true);

    try {
      const res = await getComments(card._id);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Update Task details
  const handleSaveTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Task title is required");
      return;
    }

    try {
      setSaving(true);
      await updateCard(card._id, {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        assignee: assigneeId || null,
        labels: selectedLabels,
      });
      setShowModal(false);
      triggerRefresh();
    } catch (err) {
      console.error("Failed to save task:", err);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  // Delete Task
  const handleDeleteTask = async () => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteCard(card._id);
      setShowModal(false);
      triggerRefresh();
    } catch (err) {
      console.error(err);
      alert("Failed to delete task");
    }
  };

  // Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await createComment({
        card: card._id,
        message: newComment,
      });

      setNewComment("");

      if (res?.data?.comment) {
        setComments((prev) => {
          if (prev.some((existingComment) => existingComment._id === res.data.comment._id)) {
            return prev;
          }

          return [res.data.comment, ...prev];
        });
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  // Save edited comment
  const handleSaveCommentEdit = async (commentId) => {
    if (!editingCommentText.trim()) return;
    try {
      await updateComment(commentId, { message: editingCommentText.trim() });
      setEditingCommentId(null);
      // Reload comments
      const res = await getComments(card._id);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
      alert("Failed to update comment");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((existingComment) => existingComment._id !== commentId));
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  };

  const formatCommentTime = (createdAt) => {
    if (!createdAt) return "";
    const date = new Date(createdAt);
    return date.toLocaleDateString(undefined, { 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  const renderCommentMessage = (message) => {
    if (!message) return "";

    const parts = message.split(/(@[a-zA-Z0-9._-]+(?: [a-zA-Z0-9._-]+)?)/g);

    return parts.map((part, index) => {
      if (part.startsWith("@")) {
        const username = part.slice(1).trim();
        const isMember = workspaceMembers.some(
          (m) => m.name.toLowerCase().includes(username.toLowerCase()) || 
                 m.email.toLowerCase().includes(username.toLowerCase())
        );
        if (isMember) {
          return (
            <span 
              key={index} 
              style={{ 
                color: "var(--primary)", 
                backgroundColor: "var(--primary-light)", 
                padding: "2px 6px", 
                borderRadius: "4px", 
                fontWeight: "600",
                fontSize: "11px",
                display: "inline-block",
                margin: "0 2px"
              }}
            >
              {part}
            </span>
          );
        }
      }
      return part;
    });
  };

  return (
    <>
      <div
        className="task-card"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleOpenModal}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          padding: "12px",
          backgroundColor: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "var(--radius-sm)",
          boxShadow: "var(--shadow-sm)",
          cursor: "grab",
          transition: "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "var(--primary)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "var(--border-color)";
          e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        }}
      >
        {/* Render Labels on face */}
        {card.labels && card.labels.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {card.labels.map((lbl) => {
              const matched = AVAILABLE_LABELS.find((l) => l.name === lbl);
              const labelColor = matched ? matched.color : "var(--text-muted)";
              return (
                <span
                  key={lbl}
                  style={{
                    fontSize: "9px",
                    fontWeight: "700",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    backgroundColor: labelColor,
                    color: "#ffffff",
                    textTransform: "uppercase",
                    letterSpacing: "0.03em"
                  }}
                >
                  {lbl}
                </span>
              );
            })}
          </div>
        )}

        <div className="task-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "8px" }}>
          <h4 style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)", margin: 0 }}>
            {card.title}
          </h4>
          <span className={`priority-badge ${getPriorityClass(card.priority)}`}>
            {card.priority}
          </span>
        </div>

        {card.description && (
          <p className="task-description" style={{ fontSize: "12px", color: "var(--text-muted)", margin: 0 }}>
            {card.description}
          </p>
        )}

        <div className="task-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px", color: "var(--text-muted)", paddingTop: "8px", borderTop: "1px solid var(--border-color)", marginTop: "4px" }}>
          <div className="task-assignee">👤 {card.assignee ? card.assignee.name : "Unassigned"}</div>
          <div className="task-due">📅 {formatDateDisplay(card.dueDate)}</div>
        </div>
      </div>

      {/* Card Details Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px", maxHeight: "90vh", overflowY: "auto", padding: "28px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "20px", color: "var(--text-main)" }}>
              Edit Task Details
            </h2>

            <form onSubmit={handleSaveTask}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  Task Title *
                </label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "14px", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add a detailed description..."
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    border: "1px solid var(--border-color)",
                    borderRadius: "var(--radius-sm)",
                    backgroundColor: "var(--bg-app)",
                    color: "var(--text-main)",
                    fontSize: "14px",
                    minHeight: "80px",
                    outline: "none",
                  }}
                />
              </div>

              {/* Labels Section */}
              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "8px" }}>
                  Labels
                </label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {AVAILABLE_LABELS.map((lbl) => {
                    const isSelected = selectedLabels.includes(lbl.name);
                    return (
                      <button
                        key={lbl.name}
                        type="button"
                        onClick={() => {
                          setSelectedLabels((prev) =>
                            prev.includes(lbl.name)
                              ? prev.filter((l) => l !== lbl.name)
                              : [...prev, lbl.name]
                          );
                        }}
                        style={{
                          padding: "6px 12px",
                          fontSize: "12px",
                          fontWeight: "600",
                          borderRadius: "var(--radius-sm)",
                          border: isSelected ? `2px solid ${lbl.color}` : "1px solid var(--border-color)",
                          backgroundColor: isSelected ? `${lbl.color}15` : "var(--bg-app)",
                          color: isSelected ? lbl.color : "var(--text-muted)",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                        }}
                      >
                        {isSelected ? "✓ " : ""}{lbl.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                    Priority
                  </label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)} 
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "14px", outline: "none", margin: 0 }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                    Due Date
                  </label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "14px", outline: "none", margin: 0 }} 
                  />
                </div>
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "6px" }}>
                  Assignee
                </label>
                <select 
                  value={assigneeId} 
                  onChange={(e) => setAssigneeId(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "14px", outline: "none", margin: 0 }}
                >
                  <option value="">Unassigned</option>
                  {workspaceMembers.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} ({m.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-buttons" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "20px", marginBottom: "20px", display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                <button
                  type="button"
                  className="cancel-btn"
                  style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)", padding: "10px 18px", borderRadius: "var(--radius-sm)", fontWeight: "600", cursor: "pointer" }}
                  onClick={handleDeleteTask}
                >
                  Delete Task
                </button>
                <div style={{ flex: 1 }} />
                <button 
                  type="button" 
                  className="cancel-btn" 
                  onClick={() => setShowModal(false)}
                  style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontWeight: "600", cursor: "pointer" }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="create-btn" 
                  disabled={saving}
                  style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", fontWeight: "600", cursor: "pointer" }}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            {/* Comments Section */}
            <div className="comments-section" style={{ marginTop: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px", color: "var(--text-main)" }}>
                Activity & Comments
              </h3>

              <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <input
                  type="text"
                  placeholder="Write a comment... (use @name to mention)"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ margin: 0, flex: 1, padding: "10px 14px", border: "1px solid var(--border-color)", borderRadius: "var(--radius-sm)", backgroundColor: "var(--bg-app)", color: "var(--text-main)", fontSize: "14px", outline: "none" }}
                />
                <button 
                  type="submit" 
                  className="create-btn"
                  style={{ padding: "10px 18px", borderRadius: "var(--radius-sm)", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", fontWeight: "600", cursor: "pointer" }}
                >
                  Comment
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto", paddingRight: "4px" }}>
                {loadingComments ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Loading activity...</p>
                ) : comments.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No comments yet.</p>
                ) : (
                  comments.map((c) => {
                    const isAuthor = currentUser && (c.user?._id === currentUser.id || c.user === currentUser.id);
                    const commentAuthorName = c.user?.name || "Member";

                    return (
                      <div
                        key={c._id}
                        style={{
                          backgroundColor: "var(--bg-app)",
                          padding: "10px 14px",
                          borderRadius: "var(--radius-sm)",
                          fontSize: "12.5px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "6px",
                          border: "1px solid var(--border-color)"
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div>
                            <strong style={{ color: "var(--text-main)", marginRight: "6px" }}>{commentAuthorName}</strong>
                            <small style={{ color: "var(--text-muted)", fontSize: "11px" }}>
                              {formatCommentTime(c.createdAt)}
                            </small>
                          </div>

                          {isAuthor && editingCommentId !== c._id && (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => {
                                  setEditingCommentId(c._id);
                                  setEditingCommentText(c.message);
                                }}
                                style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(c._id)}
                                style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "11px", fontWeight: "600" }}
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                        {editingCommentId === c._id ? (
                          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                            <input
                              type="text"
                              value={editingCommentText}
                              onChange={(e) => setEditingCommentText(e.target.value)}
                              style={{ flex: 1, padding: "6px 10px", fontSize: "12px", border: "1px solid var(--border-color)", borderRadius: "4px", backgroundColor: "var(--bg-card)", color: "var(--text-main)", outline: "none", margin: 0 }}
                            />
                            <button
                              onClick={() => handleSaveCommentEdit(c._id)}
                              style={{ padding: "6px 12px", fontSize: "11px", fontWeight: "600", borderRadius: "4px", border: "none", backgroundColor: "var(--primary)", color: "#ffffff", cursor: "pointer" }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingCommentId(null)}
                              style={{ padding: "6px 12px", fontSize: "11px", fontWeight: "600", borderRadius: "4px", border: "1px solid var(--border-color)", backgroundColor: "var(--bg-card)", color: "var(--text-main)", cursor: "pointer" }}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div style={{ color: "var(--text-main)", lineHeight: "1.4" }}>
                            {renderCommentMessage(c.message)}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;