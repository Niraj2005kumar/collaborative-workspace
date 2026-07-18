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

    if (!title || !title.trim()) {
      if (title !== null) alert("Task title cannot be empty.");
      return;
    }

    try {
      await createCard({
        title: title.trim(),
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
      style={{
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--bg-card)",
        border: isDragOver ? "2px dashed var(--primary)" : "1px solid var(--border-color)",
        borderRadius: "var(--radius-md)",
        padding: "16px",
        width: "300px",
        minWidth: "300px",
        maxHeight: "100%",
        boxShadow: "var(--shadow-sm)",
        transition: "border-color 0.2s ease, background-color 0.2s ease",
      }}
    >
      <div 
        className="list-header"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "8px",
          borderBottom: "1px solid var(--border-color)"
        }}
      >
        <h3
          onClick={onRenameList}
          style={{ 
            cursor: "pointer",
            fontSize: "14.5px",
            fontWeight: "600",
            color: "var(--text-main)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "180px",
          }}
          title="Click to rename list"
        >
          {list.title}
        </h3>

        <div className="list-header-actions" style={{ display: "flex", gap: "6px" }}>
          <button
            className="add-card-btn-inline"
            onClick={handleCreateCard}
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              fontWeight: "600",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--primary-light)",
              color: "var(--primary)",
              border: "none",
              cursor: "pointer",
            }}
          >
            + Task
          </button>

          <button
            className="list-delete-btn"
            onClick={onDeleteList}
            title="Delete list"
            style={{
              padding: "4px 8px",
              fontSize: "12px",
              borderRadius: "var(--radius-sm)",
              border: "none",
              cursor: "pointer",
            }}
          >
            🗑
          </button>
        </div>
      </div>

      <div 
        className="cards-container"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          overflowY: "auto",
          flex: 1,
          minHeight: "120px",
          paddingRight: "4px",
        }}
      >
        {loading ? (
          <p
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            Loading tasks...
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
          <div 
            className="empty-card"
            style={{
              padding: "24px 16px",
              textAlign: "center",
              backgroundColor: "var(--bg-app)",
              border: "1px dashed var(--border-color)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-muted)",
              fontSize: "12px",
            }}
          >
            No tasks in list
          </div>
        )}
      </div>
    </div>
  );
};

export default List;