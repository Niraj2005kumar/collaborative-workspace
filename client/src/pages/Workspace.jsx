import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getWorkspaces,
  getBoards,
  createBoard,
} from "../services/api";
import CreateBoardModal from "../components/CreateBoardModal";

const Workspace = () => {
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState(null);
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Fetch Boards
  const fetchBoards = async (workspaceId) => {
    try {
      const res = await getBoards(workspaceId);
      setBoards(res.data.boards || []);
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  // Fetch Workspace
  const fetchWorkspace = useCallback(async () => {
    try {
      const res = await getWorkspaces();

      const workspaces = res.data.workspaces || [];

      if (workspaces.length > 0) {
        const currentWorkspace = workspaces[0];

        setWorkspace(currentWorkspace);

        await fetchBoards(currentWorkspace._id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspace();
  }, [fetchWorkspace]);

  // Create Board
  const handleCreateBoard = async (title) => {
    try {
      await createBoard({
        title,
        workspace: workspace._id,
      });

      await fetchBoards(workspace._id);

      setShowModal(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create board");
    }
  };

  if (loading) {
    return <h2>Loading Workspace...</h2>;
  }

  if (!workspace) {
    return (
      <div className="workspace">
        <h2>No Workspace Found</h2>
      </div>
    );
  }

  return (
    <div className="workspace">

      {/* Header */}

      <div className="workspace-header">

        <h1>{workspace.name}</h1>

        <div style={{ display: "flex", gap: "10px" }}>

          <button
            className="create-board-btn"
            onClick={() => setShowModal(true)}
          >
            + Create Board
          </button>

          <button
            className="create-board-btn"
            onClick={() =>
              navigate("/workspace-settings")
            }
          >
            ⚙ Workspace Settings
          </button>

        </div>

      </div>

      {/* Workspace Info */}

      <div className="workspace-info">

        <div className="workspace-card">
          <h2>Workspace Name</h2>
          <p>{workspace.name}</p>
        </div>

        <div className="workspace-card">
          <h2>Description</h2>
          <p>
            {workspace.description ||
              "No description available"}
          </p>
        </div>

        <div className="workspace-card">
          <h2>Visibility</h2>
          <p>{workspace.visibility}</p>
        </div>

      </div>

      {/* Members */}

      <div className="workspace-members">

        <h2>Members</h2>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>

          <tbody>

            {workspace.members?.map((member) => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>
                  {workspace.owner?._id === member._id
                    ? "Owner"
                    : "Member"}
                </td>
              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Boards */}

      <div className="boards-section">

        <h2>Boards</h2>

        <div className="boards-grid">

          {boards.length === 0 ? (
            <div className="board-card">
              <h3>No Boards Available</h3>
              <p>Create your first board.</p>
            </div>
          ) : (
            boards.map((board) => (
              <div
                key={board._id}
                className="board-card"
                onClick={() =>
                  navigate(`/board/${board._id}`)
                }
                style={{ cursor: "pointer" }}
              >
                <h3>{board.title}</h3>

                <p>
                  Click to open this board
                </p>

              </div>
            ))
          )}

        </div>

      </div>

      {/* Create Board Modal */}

      <CreateBoardModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreate={handleCreateBoard}
      />

    </div>
  );
};

export default Workspace;