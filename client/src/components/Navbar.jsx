import React from "react";
import {
  FaBell,
  FaSearch,
  FaUserCircle,
} from "react-icons/fa";

const Navbar = () => {
  return (
    <nav className="navbar">

      <div className="navbar-left">
        <h2>Dashboard</h2>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search workspace..."
          />
        </div>
      </div>

      <div className="navbar-right">

        <button className="notification-btn">
          <FaBell />
        </button>

        <div className="profile">
          <FaUserCircle className="profile-icon" />
          <div className="profile-info">
            <span className="profile-name">
              Niraj Verma
            </span>
            <small>Member</small>
          </div>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;