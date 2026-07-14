import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { useTasks } from "../context/TaskContext";

function Tasks() {
  const navigate = useNavigate();

  const {
    tasks,
    statistics,
    priorityWeight,
    clearCompletedTasks,
    isTaskOverdue,
  } = useTasks();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const title = task.title?.toLowerCase() || "";
      const description = task.description?.toLowerCase() || "";
      const category = task.category?.toLowerCase() || "";

      const matchesSearch =
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        category.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Pending" && !task.completed && !isTaskOverdue(task)) ||
        (statusFilter === "Completed" && task.completed) ||
        (statusFilter === "Overdue" && isTaskOverdue(task));

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "All" || task.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesCategory
      );
    });

    return [...filtered].sort((firstTask, secondTask) => {
      if (sortOption === "Newest") {
        return (
          new Date(secondTask.createdAt || 0) -
          new Date(firstTask.createdAt || 0)
        );
      }

      if (sortOption === "Oldest") {
        return (
          new Date(firstTask.createdAt || 0) -
          new Date(secondTask.createdAt || 0)
        );
      }

      if (sortOption === "Due Date") {
        return (
          new Date(firstTask.dueDate || "9999-12-31") -
          new Date(secondTask.dueDate || "9999-12-31")
        );
      }

      if (sortOption === "Priority") {
        return (
          priorityWeight[secondTask.priority] -
          priorityWeight[firstTask.priority]
        );
      }

      return 0;
    });
  }, [
    tasks,
    searchTerm,
    statusFilter,
    priorityFilter,
    categoryFilter,
    sortOption,
    isTaskOverdue,
    priorityWeight,
  ]);

  const activeFiltersCount = [
    searchTerm.trim() !== "",
    statusFilter !== "All",
    priorityFilter !== "All",
    categoryFilter !== "All",
    sortOption !== "Newest",
  ].filter(Boolean).length;

  function resetFilters() {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setSortOption("Newest");
  }

  function handleClearCompleted() {
    if (statistics.completed === 0) {
      window.alert("There are no completed tasks to clear.");
      return;
    }

    const shouldClear = window.confirm(
      `Delete ${statistics.completed} completed task(s)?`
    );

    if (shouldClear) {
      clearCompletedTasks();
    }
  }

  function handleEdit(task) {
    navigate(`/add-task?edit=${task.id}`);
  }

  return (
    <div className="tasks-page">
      <section className="tasks-page-summary">
        <div>
          <span className="tasks-page-eyebrow">TASK WORKSPACE</span>
          <h2>Organize everything in one place</h2>
          <p>
            Search, filter, prioritize and manage all your tasks from this
            workspace.
          </p>
        </div>

        <button
          type="button"
          className="tasks-create-button"
          onClick={() => navigate("/add-task")}
        >
          ＋ Create New Task
        </button>
      </section>

      <section className="tasks-mini-stat-grid">
        <MiniStatCard
          label="All tasks"
          value={statistics.total}
          icon="▤"
          variant="purple"
          active={statusFilter === "All"}
          onClick={() => setStatusFilter("All")}
        />

        <MiniStatCard
          label="Pending"
          value={statistics.pending}
          icon="◷"
          variant="orange"
          active={statusFilter === "Pending"}
          onClick={() => setStatusFilter("Pending")}
        />

        <MiniStatCard
          label="Completed"
          value={statistics.completed}
          icon="✓"
          variant="green"
          active={statusFilter === "Completed"}
          onClick={() => setStatusFilter("Completed")}
        />

        <MiniStatCard
          label="Overdue"
          value={statistics.overdue}
          icon="!"
          variant="red"
          active={statusFilter === "Overdue"}
          onClick={() => setStatusFilter("Overdue")}
        />
      </section>

      <section className="tasks-toolbar-panel">
        <div className="tasks-search-wrapper">
          <span className="tasks-search-icon">⌕</span>

          <input
            type="text"
            placeholder="Search by title, description or category..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          {searchTerm && (
            <button
              type="button"
              className="tasks-search-clear"
              onClick={() => setSearchTerm("")}
            >
              ×
            </button>
          )}
        </div>

        <div className="tasks-filter-grid">
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All status</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Overdue">Overdue</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
          >
            <option value="All">All priorities</option>
            <option value="High">High priority</option>
            <option value="Medium">Medium priority</option>
            <option value="Low">Low priority</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="All">All categories</option>
            <option value="Study">Study</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Project">Project</option>
            <option value="Urgent">Urgent</option>
          </select>

          <select
            value={sortOption}
            onChange={(event) => setSortOption(event.target.value)}
          >
            <option value="Newest">Newest first</option>
            <option value="Oldest">Oldest first</option>
            <option value="Due Date">Due date</option>
            <option value="Priority">Priority</option>
          </select>
        </div>

        <div className="tasks-toolbar-actions">
          <button
            type="button"
            className="tasks-reset-button"
            onClick={resetFilters}
            disabled={activeFiltersCount === 0}
          >
            Reset filters
            {activeFiltersCount > 0 && (
              <span>{activeFiltersCount}</span>
            )}
          </button>

          <button
            type="button"
            className="tasks-clear-completed-button"
            onClick={handleClearCompleted}
          >
            Clear completed
          </button>
        </div>
      </section>

      <section className="tasks-content-panel">
        <div className="tasks-content-heading">
          <div>
            <span className="panel-label">YOUR WORK</span>
            <h3>
              {statusFilter === "All" ? "All Tasks" : `${statusFilter} Tasks`}
            </h3>
            <p>
              Showing {filteredTasks.length} of {tasks.length} tasks
            </p>
          </div>

          <div className="tasks-result-badge">
            {filteredTasks.length} result
            {filteredTasks.length === 1 ? "" : "s"}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="tasks-page-empty-state">
            <div className="tasks-empty-illustration">
              <span>✓</span>
            </div>

            <h3>
              {tasks.length === 0
                ? "Your task list is empty"
                : "No matching tasks found"}
            </h3>

            <p>
              {tasks.length === 0
                ? "Create your first task and begin organizing your work."
                : "Try changing or resetting your current search and filters."}
            </p>

            <div className="tasks-empty-actions">
              {tasks.length === 0 ? (
                <button
                  type="button"
                  onClick={() => navigate("/add-task")}
                >
                  ＋ Create First Task
                </button>
              ) : (
                <button type="button" onClick={resetFilters}>
                  Reset Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="professional-task-grid">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function MiniStatCard({
  label,
  value,
  icon,
  variant,
  active,
  onClick,
}) {
  return (
    <button
      type="button"
      className={`tasks-mini-stat-card mini-stat-${variant} ${
        active ? "mini-stat-active" : ""
      }`}
      onClick={onClick}
    >
      <span className="tasks-mini-stat-icon">{icon}</span>

      <span className="tasks-mini-stat-content">
        <small>{label}</small>
        <strong>{value}</strong>
      </span>
    </button>
  );
}

export default Tasks;