
import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
  return (
    <Link
      to={`/projects/${project._id}`}
      className="block transition-transform duration-300 hover:scale-105"
    >
      <div className="bg-white rounded-xl shadow-md hover:shadow-xl border border-gray-200 p-5 h-full">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {project.name}
          </h2>

          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: project.color }}
          ></span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.description || "No description available."}
        </p>

        {/* Status */}
        <div className="mb-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold
              ${
                project.status === "Planning"
                  ? "bg-yellow-100 text-yellow-700"
                  : project.status === "Active"
                  ? "bg-green-100 text-green-700"
                  : project.status === "Completed"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-200 text-gray-700"
              }`}
          >
            {project.status}
          </span>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>
            Members: {project.members?.length || 0}
          </span>

          <span>
            Boards: {project.boards?.length || 0}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;