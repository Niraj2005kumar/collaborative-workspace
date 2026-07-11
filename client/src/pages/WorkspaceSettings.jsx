

const WorkspaceSettings = () => {
  return (
    <div className="workspace-settings">

      <h1>Workspace Settings</h1>

      <div className="settings-card">

        <h2>Rename Workspace</h2>

        <input
          type="text"
          placeholder="Enter workspace name"
          defaultValue="Collaborative Workspace"
        />

        <textarea
          placeholder="Workspace Description"
          defaultValue="Manage your projects and collaborate with your team."
        />

        <select defaultValue="private">
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>

        <button className="save-btn">
          Save Changes
        </button>

      </div>

      <div className="settings-card">

        <h2>Workspace Members</h2>

        <table>

          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Niraj Verma</td>
              <td>niraj@gmail.com</td>
              <td>Owner</td>
              <td>-</td>
            </tr>

            <tr>
              <td>Rahul Kumar</td>
              <td>rahul@gmail.com</td>
              <td>Member</td>
              <td>
                <button className="remove-btn">
                  Remove
                </button>
              </td>
            </tr>

            <tr>
              <td>Aman Singh</td>
              <td>aman@gmail.com</td>
              <td>Member</td>
              <td>
                <button className="remove-btn">
                  Remove
                </button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      <div className="settings-card danger-zone">

        <h2>Danger Zone</h2>

        <p>
          Once you delete this workspace, all boards,
          tasks and members will be removed permanently.
        </p>

        <button className="delete-btn">
          Delete Workspace
        </button>

      </div>

    </div>
  );
};

export default WorkspaceSettings;