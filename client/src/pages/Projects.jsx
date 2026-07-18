import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../services/api";
import ProjectCard from "../components/ProjectCard";

const Projects = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await getProjects(workspaceId);
      setProjects(res.data.projects || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }, [workspaceId]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleCreateProject = async () => {
    const name = prompt("Enter Project Name");
    if (!name) return;

    const description = prompt("Enter Description") || "";

    try {
      await createProject({
        name,
        description,
        workspace: workspaceId,
      });

      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to create project");
    }
  };

  const handleRenameProject = async (project) => {
    const name = prompt("Rename Project", project.name);

    if (!name || name === project.name) return;

    try {
      await updateProject(project._id, { name });
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Rename failed");
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await deleteProject(id);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <h2>Loading Projects...</h2>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="board-header">
        <h1>Projects</h1>

        <button
          className="create-board-btn"
          onClick={handleCreateProject}
        >
          + Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <h3>No Projects Found</h3>
          <p>Create your first project.</p>

          <button
            className="create-board-btn"
            onClick={handleCreateProject}
          >
            Create Project
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(320px,1fr))",
            gap: "20px",
          }}
        >
          {projects.map((project) => (
            <div key={project._id}>
              <ProjectCard project={project} />

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  className="add-card-btn-inline"
                  onClick={() =>
                    handleRenameProject(project)
                  }
                >
                  Rename
                </button>

                <button
                  className="list-delete-btn"
                  onClick={() =>
                    handleDeleteProject(project._id)
                  }
                >
                  Delete
                </button>

                <button
                  className="create-board-btn"
                  onClick={() =>
                    navigate(`/projects/${project._id}`)
                  }
                >
                  Open
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;