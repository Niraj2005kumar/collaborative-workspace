import React from "react";

const Workspace = () => {
  return (
    <div className="workspace">

      <div className="workspace-header">
        <h1>Workspace</h1>
        <button className="create-board-btn">
          + Create Board
        </button>
      </div>

      <div className="workspace-info">

        <div className="workspace-card">
          <h2>Workspace Name</h2>
          <p>Collaborative Workspace</p>
        </div>

        <div className="workspace-card">
          <h2>Description</h2>
          <p>
            A collaborative platform for managing projects,
            boards, tasks and team members.
          </p>
        </div>

        <div className="workspace-card">
          <h2>Visibility</h2>
          <p>Private</p>
        </div>

      </div>

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

            <tr>
              <td>Niraj Verma</td>
              <td>niraj@gmail.com</td>
              <td>Owner</td>
            </tr>

            <tr>
              <td>Rahul Kumar</td>
              <td>rahul@gmail.com</td>
              <td>Member</td>
            </tr>

            <tr>
              <td>Rohit Sharma</td>
              <td>rohit@gmail.com</td>
              <td>Member</td>
            </tr>

          </tbody>

        </table>

      </div>

      <div className="boards-section">

        <h2>Boards</h2>

        <div className="boards-grid">

          <div className="board-card">
            <h3>Frontend Board</h3>
            <p>React Development Tasks</p>
          </div>

          <div className="board-card">
            <h3>Backend Board</h3>
            <p>Node.js API Development</p>
          </div>

          <div className="board-card">
            <h3>Testing Board</h3>
            <p>Bug Tracking & QA</p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Workspace;