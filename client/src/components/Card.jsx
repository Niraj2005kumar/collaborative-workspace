import { useState } from "react";
import { 
  updateCard, 
  deleteCard, 
  getComments, 
  createComment,
  deleteComment 
} from "../services/api";

const Card = ({ card, listId, workspaceMembers, triggerRefresh }) => {
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // Edit card form state
  const [title, setTitle] = useState(card.title || "");
  const [description, setDescription] = useState(card.description || "");
  const [priority, setPriority] = useState(card.priority || "Medium");
  const [dueDate, setDueDate] = useState(card.dueDate ? card.dueDate.split('T')[0] : "");
  const [assigneeId, setAssigneeId] = useState(card.assignee?._id || "");
  const [saving, setSaving] = useState(false);

  // Handle Drag Start
  const handleDragStart = (e) => {
    e.dataTransfer.setData("cardId", card._id);
    e.dataTransfer.setData("sourceListId", listId);
    e.target.classList.add("dragging");
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("dragging");
  };

  const getPriorityClass = (pr) => {
    switch (pr) {
      case "High": return "priority-high";
      case "Medium": return "priority-medium";
      case "Low": return "priority-low";
      default: return "";
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
      await createComment({
        card: card._id,
        message: newComment,
      });
      setNewComment("");
      // Reload comments
      const res = await getComments(card._id);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  // Delete Comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Delete this comment?")) return;
    try {
      await deleteComment(commentId);
      // Reload comments
      const res = await getComments(card._id);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error(err);
      alert("Failed to delete comment");
    }
  };

  const formatDateDisplay = (dateString) => {
    if (!dateString) return "No due date";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div 
        className="task-card"
        draggable="true"
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onClick={handleOpenModal}
      >
        <div className="task-header">
          <h4>{card.title}</h4>
          <span className={`priority-badge ${getPriorityClass(card.priority)}`}>
            {card.priority}
          </span>
        </div>

        <p className="task-description">
          {card.description || "No description"}
        </p>

        <div className="task-footer">
          <div className="task-assignee">
            👤 {card.assignee ? card.assignee.name : "Unassigned"}
          </div>
          <div className="task-due">
            📅 {formatDateDisplay(card.dueDate)}
          </div>
        </div>
      </div>

      {/* Card Details Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "580px" }}>
            <h2>Edit Task Details</h2>
            
            <form onSubmit={handleSaveTask}>
              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Task Title *
              </label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />

              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
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
                  marginBottom: "16px",
                  outline: "none"
                }}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Priority
                  </label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)} style={{ marginBottom: 0 }}>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                    Due Date
                  </label>
                  <input 
                    type="date" 
                    value={dueDate} 
                    onChange={(e) => setDueDate(e.target.value)} 
                    style={{ marginBottom: 0 }}
                  />
                </div>
              </div>

              <label style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-muted)", display: "block", marginBottom: "4px" }}>
                Assignee
              </label>
              <select value={assigneeId} onChange={(e) => setAssigneeId(e.target.value)}>
                <option value="">Unassigned</option>
                {workspaceMembers.map(m => (
                  <option key={m._id} value={m._id}>{m.name} ({m.email})</option>
                ))}
              </select>

              <div className="modal-buttons" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "20px", marginBottom: "20px" }}>
                <button 
                  type="button" 
                  className="cancel-btn" 
                  style={{ backgroundColor: "var(--danger-bg)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)" }} 
                  onClick={handleDeleteTask}
                >
                  Delete Task
                </button>
                <div style={{ flex: 1 }} />
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="create-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>

            {/* Comments Section */}
            <div className="comments-section">
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "12px" }}>Activity & Comments</h3>
              
              <form onSubmit={handleAddComment} style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <input 
                  type="text" 
                  placeholder="Write a comment..." 
                  value={newComment} 
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ margin: 0, flex: 1 }}
                />
                <button type="submit" className="create-btn">Comment</button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "150px", overflowY: "auto" }}>
                {loadingComments ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Loading activity...</p>
                ) : comments.length === 0 ? (
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", fontStyle: "italic" }}>No comments yet.</p>
                ) : (
                  comments.map(c => (
                    <div 
                      key={c._id} 
                      style={{ 
                        backgroundColor: "var(--bg-app)", 
                        padding: "8px 12px", 
                        borderRadius: "var(--radius-sm)",
                        fontSize: "12px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start"
                      }}
                    >
                      <div>
                        <strong style={{ color: "var(--text-main)" }}>{c.user?.name || "Member"}: </strong>
                        <span style={{ color: "var(--text-muted)" }}>{c.message}</span>
                      </div>
                      <button 
                        onClick={() => handleDeleteComment(c._id)}
                        style={{ background: "none", border: "none", color: "var(--danger)", cursor: "pointer", fontSize: "11px" }}
                      >
                        Delete
                      </button>
                    </div>
                  ))
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