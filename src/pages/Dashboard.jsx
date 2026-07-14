import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import { useTasks } from "../context/TaskContext";

function Dashboard() {
  const navigate = useNavigate();

  const {
    tasks,
    statistics,
    toggleTask,
    deleteTask,
    isTaskOverdue,
  } = useTasks();

  const recentTasks = useMemo(() => {
    return [...tasks]
      .sort((firstTask, secondTask) => {
        return (
          new Date(secondTask.createdAt || 0) -
          new Date(firstTask.createdAt || 0)
        );
      })
      .slice(0, 4);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return tasks
      .filter((task) => !task.completed && task.dueDate)
      .sort((firstTask, secondTask) => {
        return (
          new Date(firstTask.dueDate) -
          new Date(secondTask.dueDate)
        );
      })
      .slice(0, 4);
  }, [tasks]);

  const priorityData = useMemo(() => {
    const pendingTasks = tasks.filter((task) => !task.completed);

    return {
      high: pendingTasks.filter(
        (task) => task.priority === "High"
      ).length,

      medium: pendingTasks.filter(
        (task) => task.priority === "Medium"
      ).length,

      low: pendingTasks.filter(
        (task) => task.priority === "Low"
      ).length,
    };
  }, [tasks]);

  function formatDate(dateValue) {
    if (!dateValue) {
      return "No due date";
    }

    return new Date(`${dateValue}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }

  function getDaysMessage(dateValue) {
    if (!dateValue) {
      return "";
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${dateValue}T00:00:00`);

    const difference = Math.ceil(
      (dueDate - today) / (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
      return `${Math.abs(difference)} day(s) overdue`;
    }

    if (difference === 0) {
      return "Due today";
    }

    if (difference === 1) {
      return "Due tomorrow";
    }

    return `${difference} days remaining`;
  }

  function handleDelete(taskId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (shouldDelete) {
      deleteTask(taskId);
    }
  }

  return (
    <div className="dashboard-page">
      <section className="dashboard-welcome-banner">
        <div className="welcome-banner-content">
          <span className="welcome-eyebrow">
            YOUR PRODUCTIVITY WORKSPACE
          </span>

          <h2>
            Good morning, Dakshita
            <span className="welcome-emoji">👋</span>
          </h2>

          <p>
            You have{" "}
            <strong>{statistics.pending} pending task(s)</strong>{" "}
            waiting for your attention. Keep moving forward.
          </p>

          <div className="welcome-actions">
            <button
              type="button"
              className="welcome-primary-button"
              onClick={() => navigate("/add-task")}
            >
              ＋ Create New Task
            </button>

            <button
              type="button"
              className="welcome-secondary-button"
              onClick={() => navigate("/tasks")}
            >
              View All Tasks
            </button>
          </div>
        </div>

        <div className="welcome-visual">
          <div className="welcome-visual-circle circle-one" />
          <div className="welcome-visual-circle circle-two" />

          <div className="welcome-task-preview">
            <span className="preview-check">✓</span>

            <div>
              <strong>Stay focused</strong>
              <small>One task at a time</small>
            </div>
          </div>

          <div className="welcome-progress-preview">
            <span>{statistics.completionPercentage}%</span>

            <div className="preview-progress-track">
              <div
                style={{
                  width: `${statistics.completionPercentage}%`,
                }}
              />
            </div>

            <small>Overall progress</small>
          </div>
        </div>
      </section>

      <section className="dashboard-stat-grid">
        <StatCard
          title="Total Tasks"
          value={statistics.total}
          description="All tasks created"
          icon="▤"
          variant="purple"
        />

        <StatCard
          title="Pending Tasks"
          value={statistics.pending}
          description="Still need attention"
          icon="◷"
          variant="orange"
        />

        <StatCard
          title="Completed"
          value={statistics.completed}
          description="Successfully finished"
          icon="✓"
          variant="green"
        />

        <StatCard
          title="Overdue"
          value={statistics.overdue}
          description="Past their deadline"
          icon="!"
          variant="red"
        />
      </section>

      <section className="dashboard-insights-grid">
        <article className="dashboard-panel progress-overview-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">PERFORMANCE</span>
              <h3>Overall Progress</h3>
              <p>Track your task completion rate.</p>
            </div>

            <div className="completion-percentage">
              {statistics.completionPercentage}%
            </div>
          </div>

          <div className="large-progress-track">
            <div
              className="large-progress-fill"
              style={{
                width: `${statistics.completionPercentage}%`,
              }}
            />
          </div>

          <div className="progress-summary-row">
            <div>
              <span className="summary-dot completed-dot" />
              <p>
                Completed
                <strong>{statistics.completed}</strong>
              </p>
            </div>

            <div>
              <span className="summary-dot pending-dot" />
              <p>
                Pending
                <strong>{statistics.pending}</strong>
              </p>
            </div>

            <div>
              <span className="summary-dot overdue-dot" />
              <p>
                Overdue
                <strong>{statistics.overdue}</strong>
              </p>
            </div>
          </div>

          {statistics.total === 0 ? (
            <div className="dashboard-insight-message">
              Create your first task to begin tracking progress.
            </div>
          ) : (
            <div className="dashboard-insight-message">
              {statistics.completionPercentage >= 75
                ? "Excellent progress. You are close to completing your goals."
                : statistics.completionPercentage >= 40
                  ? "Good progress. Keep completing tasks consistently."
                  : "You have a fresh opportunity to improve your productivity."}
            </div>
          )}
        </article>

        <article className="dashboard-panel priority-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">WORKLOAD</span>
              <h3>Priority Overview</h3>
              <p>Pending tasks grouped by importance.</p>
            </div>

            <button
              type="button"
              className="panel-link-button"
              onClick={() => navigate("/tasks")}
            >
              Manage
            </button>
          </div>

          <div className="priority-list">
            <PriorityRow
              label="High priority"
              value={priorityData.high}
              total={statistics.pending}
              variant="high"
            />

            <PriorityRow
              label="Medium priority"
              value={priorityData.medium}
              total={statistics.pending}
              variant="medium"
            />

            <PriorityRow
              label="Low priority"
              value={priorityData.low}
              total={statistics.pending}
              variant="low"
            />
          </div>
        </article>
      </section>

      <section className="dashboard-bottom-grid">
        <article className="dashboard-panel recent-tasks-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">LATEST ACTIVITY</span>
              <h3>Recent Tasks</h3>
              <p>Your most recently created tasks.</p>
            </div>

            <button
              type="button"
              className="panel-link-button"
              onClick={() => navigate("/tasks")}
            >
              View all
            </button>
          </div>

          {recentTasks.length === 0 ? (
            <DashboardEmptyState
              icon="☑"
              title="No tasks created yet"
              description="Create your first task and it will appear here."
              buttonText="Create Task"
              onClick={() => navigate("/add-task")}
            />
          ) : (
            <div className="dashboard-task-list">
              {recentTasks.map((task) => {
                const overdue = isTaskOverdue(task);

                return (
                  <article
                    className={`dashboard-task-row ${
                      task.completed ? "task-row-completed" : ""
                    }`}
                    key={task.id}
                  >
                    <button
                      type="button"
                      className={`dashboard-task-checkbox ${
                        task.completed ? "checked" : ""
                      }`}
                      onClick={() => toggleTask(task.id)}
                      aria-label={`Toggle ${task.title}`}
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div className="dashboard-task-details">
                      <div className="dashboard-task-title-row">
                        <h4>{task.title}</h4>

                        <span
                          className={`mini-category-badge category-${(
                            task.category || "general"
                          ).toLowerCase()}`}
                        >
                          {task.category || "General"}
                        </span>
                      </div>

                      <p>
                        {task.description ||
                          "No description provided"}
                      </p>
                    </div>

                    <div className="dashboard-task-meta">
                      <span
                        className={`mini-priority-badge priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                      <span
                        className={`dashboard-due-date ${
                          overdue ? "date-overdue" : ""
                        }`}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="dashboard-delete-button"
                      onClick={() => handleDelete(task.id)}
                      aria-label={`Delete ${task.title}`}
                      title="Delete task"
                    >
                      ×
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </article>

        <article className="dashboard-panel upcoming-panel">
          <div className="panel-heading">
            <div>
              <span className="panel-label">DEADLINES</span>
              <h3>Upcoming Tasks</h3>
              <p>Keep an eye on approaching dates.</p>
            </div>

            <button
              type="button"
              className="panel-link-button"
              onClick={() => navigate("/calendar")}
            >
              Calendar
            </button>
          </div>

          {upcomingTasks.length === 0 ? (
            <DashboardEmptyState
              icon="◫"
              title="No upcoming deadlines"
              description="Tasks with due dates will appear here."
              buttonText="Add Task"
              onClick={() => navigate("/add-task")}
            />
          ) : (
            <div className="upcoming-task-list">
              {upcomingTasks.map((task) => {
                const overdue = isTaskOverdue(task);

                return (
                  <article
                    className={`upcoming-task-item ${
                      overdue ? "upcoming-overdue" : ""
                    }`}
                    key={task.id}
                  >
                    <div className="upcoming-date-box">
                      <strong>
                        {new Date(
                          `${task.dueDate}T00:00:00`
                        ).getDate()}
                      </strong>

                      <span>
                        {new Date(
                          `${task.dueDate}T00:00:00`
                        )
                          .toLocaleDateString("en-IN", {
                            month: "short",
                          })
                          .toUpperCase()}
                      </span>
                    </div>

                    <div className="upcoming-task-content">
                      <h4>{task.title}</h4>

                      <p
                        className={
                          overdue ? "upcoming-overdue-text" : ""
                        }
                      >
                        {getDaysMessage(task.dueDate)}
                      </p>
                    </div>

                    <span
                      className={`mini-priority-badge priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </article>
      </section>

      <section className="quick-actions-section">
        <div className="quick-actions-heading">
          <div>
            <span className="panel-label">SHORTCUTS</span>
            <h3>Quick Actions</h3>
          </div>
        </div>

        <div className="quick-action-grid">
          <QuickAction
            icon="＋"
            title="Create task"
            description="Add a new task to your workspace."
            onClick={() => navigate("/add-task")}
          />

          <QuickAction
            icon="☷"
            title="Manage tasks"
            description="Search, filter and edit your tasks."
            onClick={() => navigate("/tasks")}
          />

          <QuickAction
            icon="◫"
            title="View calendar"
            description="Review tasks by their due dates."
            onClick={() => navigate("/calendar")}
          />

          <QuickAction
            icon="⚙"
            title="Preferences"
            description="Update theme and workspace options."
            onClick={() => navigate("/settings")}
          />
        </div>
      </section>
    </div>
  );
}

function PriorityRow({ label, value, total, variant }) {
  const percentage =
    total === 0 ? 0 : Math.round((value / total) * 100);

  return (
    <div className="priority-row">
      <div className="priority-row-heading">
        <div>
          <span className={`priority-indicator ${variant}`} />
          <p>{label}</p>
        </div>

        <strong>{value}</strong>
      </div>

      <div className="priority-progress-track">
        <div
          className={`priority-progress-fill fill-${variant}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      <span className="priority-percentage">
        {percentage}% of pending tasks
      </span>
    </div>
  );
}

function DashboardEmptyState({
  icon,
  title,
  description,
  buttonText,
  onClick,
}) {
  return (
    <div className="dashboard-empty-state">
      <div className="dashboard-empty-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{description}</p>

      <button type="button" onClick={onClick}>
        {buttonText}
      </button>
    </div>
  );
}

function QuickAction({ icon, title, description, onClick }) {
  return (
    <button
      type="button"
      className="quick-action-card"
      onClick={onClick}
    >
      <span className="quick-action-icon">{icon}</span>

      <span className="quick-action-content">
        <strong>{title}</strong>
        <small>{description}</small>
      </span>

      <span className="quick-action-arrow">→</span>
    </button>
  );
}

export default Dashboard;