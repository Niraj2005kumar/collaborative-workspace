import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Workspace Portal</h2>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search workspace tasks..."
          />
        </div>
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
    </nav>
  );
};

export default Navbar;