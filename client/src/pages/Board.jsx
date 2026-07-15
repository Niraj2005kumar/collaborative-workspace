import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLists } from "../services/api";
import List from "../components/List";

const Board = () => {
  const { boardId } = useParams();

  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLists = async () => {
    try {
      const res = await getLists(boardId);

      setLists(res.data.lists || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (boardId) {
      fetchLists();
    }
  }, [boardId]);

  if (loading) {
    return <h2>Loading Board...</h2>;
  }

  return (
    <div className="board-page">

      <div className="board-header">

        <h1>Project Board</h1>

        <button className="create-board-btn">
          + Create List
        </button>

      </div>

      <div className="lists-container">

        {lists.length > 0 ? (
          lists.map((list) => (
            <List
              key={list._id}
              list={list}
            />
          ))
        ) : (
          <div className="board-card">
            <h3>No Lists Found</h3>

            <p>
              Click <strong>Create List</strong> to add your first list.
            </p>
          </div>
        )}

      </div>

    </div>
  );
};

export default Board;