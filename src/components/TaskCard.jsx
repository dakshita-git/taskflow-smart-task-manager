import { useState } from "react";
import { useTasks } from "../context/TaskContext";

function TaskCard({ task, onEdit }) {
  const { toggleTask, deleteTask, isTaskOverdue } = useTasks();
  const [showActions, setShowActions] = useState(false);

  const overdue = isTaskOverdue(task);

  function formatDate(dateValue) {
    if (!dateValue) {
      return "No due date";
    }

    return new Date(`${dateValue}T00:00:00`).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function handleDelete() {
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${task.title}"?`
    );

    if (shouldDelete) {
      deleteTask(task.id);
    }
  }

  return (
    <article
      className={`professional-task-card ${
        task.completed ? "professional-task-completed" : ""
      } ${overdue ? "professional-task-overdue" : ""}`}
    >
      <div className="task-card-top-row">
        <button
          type="button"
          className={`task-completion-button ${
            task.completed ? "task-completion-checked" : ""
          }`}
          onClick={() => toggleTask(task.id)}
          aria-label={`Toggle ${task.title}`}
        >
          {task.completed ? "✓" : ""}
        </button>

        <div className="task-card-title-content">
          <div className="task-card-title-row">
            <h3>{task.title}</h3>

            <span
              className={`task-category-pill category-${(
                task.category || "general"
              ).toLowerCase()}`}
            >
              {task.category || "General"}
            </span>
          </div>

          <p>{task.description || "No description provided"}</p>
        </div>

        <div className="task-card-menu-wrapper">
          <button
            type="button"
            className="task-card-menu-button"
            onClick={() => setShowActions((previous) => !previous)}
            aria-label="Open task menu"
          >
            ⋯
          </button>

          {showActions && (
            <div className="task-card-menu">
              <button
                type="button"
                onClick={() => {
                  onEdit(task);
                  setShowActions(false);
                }}
              >
                Edit task
              </button>

              <button
                type="button"
                className="task-menu-delete"
                onClick={handleDelete}
              >
                Delete task
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="task-card-footer">
        <div className="task-card-badges">
          <span
            className={`task-priority-pill priority-${task.priority.toLowerCase()}`}
          >
            {task.priority} priority
          </span>

          <span
            className={`task-status-pill ${
              task.completed
                ? "status-completed"
                : overdue
                  ? "status-overdue"
                  : "status-pending"
            }`}
          >
            {task.completed ? "Completed" : overdue ? "Overdue" : "Pending"}
          </span>
        </div>

        <div className={`task-card-date ${overdue ? "task-date-overdue" : ""}`}>
          <span>◫</span>
          {formatDate(task.dueDate)}
        </div>
      </div>
    </article>
  );
}

export default TaskCard;