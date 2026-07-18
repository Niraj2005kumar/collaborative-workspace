import { useState } from "react";

const CreateBoardModal = ({ isOpen, onClose, onCreate }) => {
  const [title, setTitle] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter board name");
      return;
    }

    onCreate(title.trim());
    setTitle("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div 
        className="modal"
        style={{
          background: "var(--bg-card)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--border-color)",
          boxShadow: "var(--shadow-lg)",
          padding: "32px",
          width: "100%",
          maxWidth: "440px",
          transform: "scale(1)",
          transition: "transform 0.2s ease",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "10px", color: "var(--text-main)" }}>
          Create New Board
        </h2>
        <p style={{ fontSize: "13.5px", color: "var(--text-muted)", marginBottom: "20px" }}>
          Add a new board column or dashboard to organize your project workflow.
        </p>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "20px" }}>
            <label 
              htmlFor="board-name-input"
              style={{
                display: "block",
                fontSize: "12px",
                fontWeight: "600",
                color: "var(--text-muted)",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: "6px"
              }}
            >
              Board Name *
            </label>
            <input
              id="board-name-input"
              type="text"
              placeholder="e.g. Sprint Backlog, Phase 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
                fontSize: "15px",
                outline: "none",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "var(--primary)";
                e.target.style.boxShadow = "0 0 0 3px rgba(79, 70, 229, 0.15)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div className="modal-buttons" style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-app)",
                color: "var(--text-main)",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.15s ease"
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="create-btn"
              style={{
                padding: "10px 18px",
                borderRadius: "var(--radius-md)",
                border: "none",
                backgroundColor: "var(--primary)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "background-color 0.15s ease"
              }}
            >
              Create Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBoardModal;