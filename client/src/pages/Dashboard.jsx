import React from "react";

const Dashboard = () => {
  return (
    <div className="dashboard">

      <h1 className="dashboard-title">Dashboard</h1>

      <div className="dashboard-cards">

        <div className="card">
          <h3>Total Workspaces</h3>
          <h2>5</h2>
        </div>

        <div className="card">
          <h3>Total Members</h3>
          <h2>18</h2>
        </div>

        <div className="card">
          <h3>Pending Invitations</h3>
          <h2>3</h2>
        </div>

        <div className="card">
          <h3>Active Boards</h3>
          <h2>12</h2>
        </div>

      </div>

      <div className="recent-workspaces">

        <h2>Recent Workspaces</h2>

        <table>

          <thead>
            <tr>
              <th>Workspace</th>
              <th>Owner</th>
              <th>Members</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Project Alpha</td>
              <td>Niraj Verma</td>
              <td>6</td>
              <td>Active</td>
            </tr>

            <tr>
              <td>CRM System</td>
              <td>Rahul</td>
              <td>8</td>
              <td>Active</td>
            </tr>

            <tr>
              <td>College Portal</td>
              <td>Rohit</td>
              <td>4</td>
              <td>Completed</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Dashboard;