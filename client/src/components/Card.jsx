const Card = ({ card }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#ef4444";

      case "Medium":
        return "#f59e0b";

      case "Low":
        return "#22c55e";

      default:
        return "#64748b";
    }
  };

  return (
    <div className="task-card">

      <div className="task-header">

        <h4>{card.title}</h4>

        <span
          className="priority-badge"
          style={{
            background: getPriorityColor(card.priority),
          }}
        >
          {card.priority}
        </span>

      </div>

      <p className="task-description">
        {card.description || "No Description"}
      </p>

      <div className="task-footer">

        <div>
          <strong>Assignee:</strong>{" "}
          {card.assignee
            ? card.assignee.name
            : "Unassigned"}
        </div>

        <div>
          <strong>Due:</strong>{" "}
          {card.dueDate
            ? new Date(card.dueDate).toLocaleDateString()
            : "No Due Date"}
        </div>

      </div>

    </div>
  );
};

export default Card;