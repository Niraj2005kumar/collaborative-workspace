import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaFolderOpen,
  FaUsers,
  FaEnvelope,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: <FaHome />,
    },
    {
      name: "Workspaces",
      path: "/workspaces",
      icon: <FaFolderOpen />,
    },
    {
      name: "Members",
      path: "/members",
      icon: <FaUsers />,
    },
    {
      name: "Invitations",
      path: "/invitations",
      icon: <FaEnvelope />,
    },
    {
      name: "Settings",
      path: "/settings",
      icon: <FaCog />,
    },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h2>Collaborative Workspace</h2>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={location.pathname === item.path ? "active" : ""}
          >
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;