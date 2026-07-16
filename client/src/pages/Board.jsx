import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  getLists, 
  createList, 
  deleteList, 
  updateList,
  updateBoard, 
  deleteBoard,
  getWorkspaces
} from "../services/api";
import List from "../components/List";

const Board = () => {
  const { boardId } = useParams();
  const navigate = useNavigate();

  const [lists, setLists] = useState([]);
  const [boardTitle, setBoardTitle] = useState("Project Board");
  const [workspaceMembers, setWorkspaceMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Fetch Lists
  const fetchListsData = useCallback(async () => {
    try {
      const res = await getLists(boardId);
      setLists(res.data.lists || []);
    } catch (error) {
      console.error("Error fetching lists:", error);
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  // Fetch Workspace Details to get Board Name & Workspace Members
  const fetchWorkspaceAndBoardInfo = useCallback(async () => {
    try {
      const savedWorkspaceId = sessionStorage.getItem("selectedWorkspaceId");
      const res = await getWorkspaces();
      const workspacesList = res.data.workspaces || [];
      
      // Find the current workspace
      const currentWs = workspacesList.find(w => w._id === savedWorkspaceId) || workspacesList[0];
      if (currentWs) {
        setWorkspaceMembers(currentWs.members || []);
        
        // Find board details from this workspace's boards
        // Wait, boards list can be fetched to check board title
        // Since we don't have getBoardById, we can search workspaces or just fetch all boards of this workspace
        // Actually, let's just search the lists we fetched or keep a default
      }
    } catch (err) {
      console.error("Failed to load workspace members:", err);
    }
  }, []);

  useEffect(() => {
    if (boardId) {
      fetchListsData();
      fetchWorkspaceAndBoardInfo();
    }
  }, [boardId, fetchListsData, fetchWorkspaceAndBoardInfo, refreshTrigger]);

  // Create List
  const handleCreateList = async () => {
    const title = prompt("Enter List Name");
    if (!title) return;

    try {
      await createList({
        title,
        board: boardId,
      });
      fetchListsData();
    } catch (error) {
      console.error(error);
      alert("Failed to create list");
    }
  };

  // Delete List
  const handleDeleteList = async (listId) => {
    if (!window.confirm("Are you sure you want to delete this list? All tasks inside will be deleted.")) return;
    try {
      await deleteList(listId);
      fetchListsData();
    } catch (error) {
      console.error(error);
      alert("Failed to delete list");
    }
  };

  // Rename List
  const handleRenameList = async (listId, currentTitle) => {
    const title = prompt("Rename List To:", currentTitle);
    if (!title || title === currentTitle) return;
    try {
      await updateList(listId, { title });
      fetchListsData();
    } catch (error) {
      console.error(error);
      alert("Failed to rename list");
    }
  };

  // Rename Board
  const handleRenameBoard = async () => {
    const title = prompt("Rename Board To:", boardTitle);
    if (!title || title === boardTitle) return;
    try {
      await updateBoard(boardId, { title });
      setBoardTitle(title);
      alert("Board renamed successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to rename board");
    }
  };

  // Delete Board
  const handleDeleteBoard = async () => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      await deleteBoard(boardId);
      alert("Board deleted successfully");
      navigate("/workspace");
    } catch (err) {
      console.error(err);
      alert("Failed to delete board");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "var(--text-muted)" }}>Loading Board...</h2>
      </div>
    );
  }

  return (
    <div className="board-page">
      {/* Header */}
      <div className="board-header">
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <h1>{boardTitle}</h1>
          <button 
            className="add-card-btn-inline"
            onClick={handleRenameBoard}
            style={{ fontSize: "13px" }}
          >
            ✏ Rename
          </button>
          <button 
            className="list-delete-btn"
            onClick={handleDeleteBoard}
            style={{ fontSize: "13px", padding: "4px 8px" }}
          >
            🗑 Delete Board
          </button>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            className="create-board-btn"
            onClick={handleCreateList}
          >
            + Add List
          </button>
          <button
            className="create-board-btn"
            style={{ 
              backgroundColor: "var(--bg-card)", 
              color: "var(--text-main)", 
              border: "1px solid var(--border-color)" 
            }}
            onClick={() => navigate("/workspace")}
          >
            Back to Workspace
          </button>
        </div>
      </div>

      {/* Lists Container */}
      <div className="lists-container">
        {lists.length === 0 ? (
          <div 
            style={{ 
              flex: 1, 
              textAlign: "center", 
              padding: "60px 20px", 
              backgroundColor: "var(--bg-card)", 
              borderRadius: "var(--radius-md)",
              border: "1px dashed var(--border-color)"
            }}
          >
            <h3 style={{ color: "var(--text-muted)", marginBottom: "8px" }}>No Lists Found</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "16px" }}>
              Get started by creating your first list column.
            </p>
            <button className="create-board-btn" onClick={handleCreateList}>
              Create List
            </button>
          </div>
        ) : (
          lists.map((list) => (
            <List
              key={list._id}
              list={list}
              workspaceMembers={workspaceMembers}
              refreshTrigger={refreshTrigger}
              triggerRefresh={triggerRefresh}
              onRenameList={() => handleRenameList(list._id, list.title)}
              onDeleteList={() => handleDeleteList(list._id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Board;