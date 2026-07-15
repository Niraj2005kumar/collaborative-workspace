import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLists, createList } from "../services/api";
import List from "../components/List";

const Board = () => {
  const { boardId } = useParams();

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Lists
  const fetchLists = async () => {
    try {
      const res = await getLists(boardId);
      setLists(res.data.lists || []);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

  // Create List
  const handleCreateList = async () => {
    const title = prompt("Enter List Name");

    if (!title) return;

    try {
      await createList({
        title,
        board: boardId,
      });

      fetchLists();

      alert("List Created Successfully");
    } catch (error) {
      console.error(error);
      alert("Failed to create list");
    }
  };

  if (loading) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <h2>Loading Board...</h2>
      </div>
    );
  }

  return (
    <div className="board-page">

      {/* Header */}

      <div className="board-header">

        <h1>Project Board</h1>

        <button
          className="create-board-btn"
          onClick={handleCreateList}
        >
          + Create List
        </button>

      </div>

      {/* Lists */}

      <div className="lists-container">

        {lists.length === 0 ? (
          <div className="board-card">
            <h3>No Lists Found</h3>

            <p>
              Click <strong>Create List</strong> to add your first list.
            </p>
          </div>
        ) : (
          lists.map((list) => (
            <List
              key={list._id}
              list={list}
            />
          ))
        )}

      </div>

    </div>
  );
};

export default Board;