import { useState, useEffect, useRef } from "react";
import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import { searchEverything } from "../services/api";

const Navbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setResults(null);
      setShowDropdown(false);
      return;
    }

    try {
      setLoading(true);
      setShowDropdown(true);
      const res = await searchEverything(val);
      setResults(res.data.results);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (type, item) => {
    setShowDropdown(false);
    setQuery("");

    switch (type) {
      case "workspace":
        sessionStorage.setItem("selectedWorkspaceId", item._id);
        navigate("/workspace");
        // Trigger a force reload or custom event to reload Workspace page if already on it
        window.dispatchEvent(new Event("storage"));
        break;
      case "project":
        navigate(`/projects/${item._id}`);
        break;
      case "board":
        navigate(`/board/${item._id}`);
        break;
      case "list":
        navigate(`/board/${item.board}`);
        break;
      case "card":
        navigate(`/board/${item.list?.board || item.list}`);
        break;
      case "member":
        // For members, we can navigate to dashboard or show profile summary
        navigate("/dashboard");
        break;
      default:
        break;
    }
  };

  const hasResults =
    results &&
    (results.workspaces?.length > 0 ||
      results.projects?.length > 0 ||
      results.boards?.length > 0 ||
      results.lists?.length > 0 ||
      results.cards?.length > 0 ||
      results.members?.length > 0);

  return (
    <nav className="navbar" style={{ position: "relative" }}>
      <div className="navbar-left">
        <h2>Workspace Portal</h2>
      </div>

      <div className="navbar-center" ref={containerRef} style={{ position: "relative" }}>
        <div className="search-box" style={{ width: "100%" }}>
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search workspace, projects, boards, cards..."
            value={query}
            onChange={handleSearch}
            onFocus={() => query.trim() && setShowDropdown(true)}
          />
        </div>

        {/* Search Results Dropdown Overlay */}
        {showDropdown && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              marginTop: "8px",
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              borderRadius: "var(--radius-md)",
              boxShadow: "var(--shadow-lg)",
              maxHeight: "400px",
              overflowY: "auto",
              zIndex: 999,
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px"
            }}
          >
            {loading ? (
              <div style={{ color: "var(--text-muted)", fontSize: "13.5px", textAlign: "center", padding: "10px" }}>
                Searching workspace items...
              </div>
            ) : !hasResults ? (
              <div style={{ color: "var(--text-muted)", fontSize: "13.5px", textAlign: "center", padding: "10px" }}>
                No results match "{query}"
              </div>
            ) : (
              <>
                {/* Workspaces */}
                {results.workspaces?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      Workspaces
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {results.workspaces.map((ws) => (
                        <div
                          key={ws._id}
                          onClick={() => handleItemClick("workspace", ws)}
                          style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background-color 0.15s ease", display: "flex", flexDirection: "column" }}
                          className="search-item-hover"
                        >
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{ws.name}</span>
                          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{ws.description || "Workspace"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {results.projects?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      Projects
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {results.projects.map((p) => (
                        <div
                          key={p._id}
                          onClick={() => handleItemClick("project", p)}
                          style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background-color 0.15s ease", display: "flex", flexDirection: "column" }}
                          className="search-item-hover"
                        >
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{p.name}</span>
                          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{p.description || "Project"}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Boards */}
                {results.boards?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      Boards
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {results.boards.map((b) => (
                        <div
                          key={b._id}
                          onClick={() => handleItemClick("board", b)}
                          style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background-color 0.15s ease" }}
                          className="search-item-hover"
                        >
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)", display: "block" }}>{b.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Lists */}
                {results.lists?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      List Columns
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {results.lists.map((l) => (
                        <div
                          key={l._id}
                          onClick={() => handleItemClick("list", l)}
                          style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background-color 0.15s ease" }}
                          className="search-item-hover"
                        >
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)", display: "block" }}>{l.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tasks (Cards) */}
                {results.cards?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      Tasks
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {results.cards.map((c) => (
                        <div
                          key={c._id}
                          onClick={() => handleItemClick("card", c)}
                          style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background-color 0.15s ease", display: "flex", flexDirection: "column" }}
                          className="search-item-hover"
                        >
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{c.title}</span>
                          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>
                            Priority: {c.priority} • Assignee: {c.assignee ? c.assignee.name : "Unassigned"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Workspace Members */}
                {results.members?.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: "11px", textTransform: "uppercase", color: "var(--text-muted)", fontWeight: "700", letterSpacing: "0.05em", marginBottom: "6px" }}>
                      Workspace Members
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      {results.members.map((m) => (
                        <div
                          key={m._id}
                          onClick={() => handleItemClick("member", m)}
                          style={{ padding: "8px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", transition: "background-color 0.15s ease", display: "flex", flexDirection: "column" }}
                          className="search-item-hover"
                        >
                          <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--text-main)" }}>{m.name}</span>
                          <span style={{ fontSize: "11.5px", color: "var(--text-muted)" }}>{m.email} ({m.role})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <div className="navbar-right">
        <button className="notification-btn" title="Notifications">
          <FaBell />
        </button>

        <div className="profile">
          <FaUserCircle className="profile-icon" />
          <div className="profile-info">
            <span className="profile-name">
              {user?.name || "User Portal"}
            </span>
            <small style={{ textTransform: "capitalize" }}>
              {user?.role || "Member"}
            </small>
          </div>
        </div>
      </div>

      {/* Global CSS for Search Hover */}
      <style>{`
        .search-item-hover:hover {
          background-color: var(--primary-light) !important;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;