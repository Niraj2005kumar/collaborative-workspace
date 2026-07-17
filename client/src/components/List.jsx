import { useEffect, useState } from "react";
import { getCards, createCard, updateCard } from "../services/api";
import { getSocket } from "../services/socket";
import Card from "./Card";

const List = ({
  list,
  workspaceMembers,
  refreshTrigger,
  triggerRefresh,
  onRenameList,
  onDeleteList,
}) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);

  const fetchCards = async () => {
    try {
      const res = await getCards(list._id);
      setCards(res.data.cards || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, [list._id, refreshTrigger]);

  useEffect(() => {
    const socket = getSocket();

    if (!socket) return;

    socket.emit("joinList", list._id);

    const handleCardCreated = (card) => {
      if (card.list === list._id) {
        setCards((prev) => {
          const exists = prev.some((c) => c._id === card._id);
          if (exists) return prev;
          return [...prev, card];
        });
      }
    };

    const handleCardUpdated = (updatedCard) => {
      setCards((prev) =>
        prev.map((card) =>
          card._id === updatedCard._id ? updatedCard : card
        )
      );
    };

    const handleCardDeleted = ({ cardId }) => {
      setCards((prev) =>
        prev.filter((card) => card._id !== cardId)
      );
    };

    const handleCardPositionsUpdated = () => {
      fetchCards();
    };

    socket.on("cardCreated", handleCardCreated);
    socket.on("cardUpdated", handleCardUpdated);
    socket.on("cardDeleted", handleCardDeleted);
    socket.on("cardPositionsUpdated", handleCardPositionsUpdated);

    return () => {
      socket.emit("leaveList", list._id);

      socket.off("cardCreated", handleCardCreated);
      socket.off("cardUpdated", handleCardUpdated);
      socket.off("cardDeleted", handleCardDeleted);
      socket.off(
        "cardPositionsUpdated",
        handleCardPositionsUpdated
      );
    };
  }, [list._id]);

  const handleCreateCard = async () => {
    const title = prompt("Enter Task Title:");

    if (!title) return;

    try {
      await createCard({
        title,
        list: list._id,
        position: cards.length,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to create task card");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const cardId = e.dataTransfer.getData("cardId");
    const sourceListId = e.dataTransfer.getData("sourceListId");

    if (!cardId || sourceListId === list._id) return;

    try {
      await updateCard(cardId, {
        list: list._id,
        position: cards.length,
      });
    } catch (err) {
      console.error("Failed to move card:", err);
    }
  };

  return (
    <div
      className={`list-column ${isDragOver ? "drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="list-header">
        <h3
          onClick={onRenameList}
          style={{ cursor: "pointer" }}
          title="Click to rename list"
        >
          {list.title}
        </h3>

        <div className="list-header-actions">
          <button
            className="add-card-btn-inline"
            onClick={handleCreateCard}
          >
            + Task
          </button>

          <button
            className="list-delete-btn"
            onClick={onDeleteList}
            title="Delete list"
          >
            🗑
          </button>
        </div>
      </div>

      <div className="cards-container">
        {loading ? (
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            Loading...
          </p>
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <Card
              key={card._id}
              card={card}
              listId={list._id}
              workspaceMembers={workspaceMembers}
              triggerRefresh={triggerRefresh}
            />
          ))
        ) : (
          <div className="empty-card">No Cards Found</div>
        )}
      </div>
    </div>
  );
};

export default List;