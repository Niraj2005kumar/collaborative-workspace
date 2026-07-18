import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
  FaHome,
  FaFolderOpen,
  FaCog,
  FaSignOutAlt,
  FaHistory,
  FaChartBar,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <FaHome />,
    },
    {
      name: "Workspace",
      path: "/workspace",
      icon: <FaFolderOpen />,
    },
    {
      name: "Activity Log",
      path: "/activity-log",
      icon: <FaHistory />,
    },
    {
      name: "Workspace Settings",
      path: "/workspace-settings",
      icon: <FaCog />,
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: <FaChartBar />,
    },
  ];

  return (
    <div className="sidebar">
      <div>
        <div className="sidebar-logo">
          <h2>Collaborative Hub</h2>
        </div>

        <ul className="sidebar-menu">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <li
                key={item.name}
                className={isActive ? "active" : ""}
              >
                <Link to={item.path}>
                  <span className="icon">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;