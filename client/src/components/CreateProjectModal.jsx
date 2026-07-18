import { useState } from "react";

const CreateProjectModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("#6366f1");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Project name is required");
      return;
    }

    onCreate({
      name,
      description,
      color,
    });

    setName("");
    setDescription("");
    setColor("#6366f1");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Project</h2>

        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

        <div className="modal-buttons">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>

          <button className="create-btn" onClick={handleSubmit}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;