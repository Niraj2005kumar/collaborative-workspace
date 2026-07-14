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

    onCreate(title);

    setTitle("");

    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>Create New Board</h2>

        <form onSubmit={handleSubmit}>

          <input
            type="text"
            placeholder="Enter Board Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="modal-buttons">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-btn"
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