import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const initialForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  category: "Study",
};

const priorityWeight = {
  High: 3,
  Medium: 2,
  Low: 1,
};

function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("taskflow-tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState(initialForm);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortOption, setSortOption] = useState("Newest");

  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("taskflow-theme") === "dark";
  });

  const taskFormRef = useRef(null);
  const taskTitleRef = useRef(null);
  const taskListRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem(
      "taskflow-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  function isTaskOverdue(task) {
    if (task.completed || !task.dueDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(`${task.dueDate}T00:00:00`);

    return dueDate < today;
  }

  const statistics = useMemo(() => {
    return {
      total: tasks.length,

      pending: tasks.filter((task) => !task.completed).length,

      completed: tasks.filter((task) => task.completed).length,

      highPriority: tasks.filter(
        (task) =>
          task.priority === "High" &&
          !task.completed
      ).length,

      overdue: tasks.filter(isTaskOverdue).length,
    };
  }, [tasks]);

  const completionPercentage =
    statistics.total === 0
      ? 0
      : Math.round(
          (statistics.completed / statistics.total) * 100
        );

  const filteredAndSortedTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      const title = task.title?.toLowerCase() || "";
      const description =
        task.description?.toLowerCase() || "";
      const category = task.category?.toLowerCase() || "";

      const matchesSearch =
        title.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        category.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" &&
          task.completed) ||
        (statusFilter === "Pending" &&
          !task.completed) ||
        (statusFilter === "Overdue" &&
          isTaskOverdue(task));

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        task.category === categoryFilter;

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
          new Date(secondTask.createdAt) -
          new Date(firstTask.createdAt)
        );
      }

      if (sortOption === "Oldest") {
        return (
          new Date(firstTask.createdAt) -
          new Date(secondTask.createdAt)
        );
      }

      if (sortOption === "Due Date") {
        return (
          new Date(firstTask.dueDate) -
          new Date(secondTask.dueDate)
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
  ]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a task title.");
      taskTitleRef.current?.focus();
      return;
    }

    if (!formData.dueDate) {
      setError("Please select a due date.");
      return;
    }

    if (editingTaskId) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title: formData.title.trim(),
                description:
                  formData.description.trim(),
                dueDate: formData.dueDate,
                priority: formData.priority,
                category: formData.category,
                updatedAt: new Date().toISOString(),
              }
            : task
        )
      );

      setEditingTaskId(null);
    } else {
      const newTask = {
        id:
          typeof crypto !== "undefined" &&
          crypto.randomUUID
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random()}`,

        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        priority: formData.priority,
        category: formData.category,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((previousTasks) => [
        newTask,
        ...previousTasks,
      ]);
    }

    setFormData(initialForm);
    setError("");

    window.setTimeout(() => {
      taskListRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  }

  function toggleTaskStatus(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  function editTask(task) {
    setFormData({
      title: task.title,
      description: task.description || "",
      dueDate: task.dueDate,
      priority: task.priority,
      category: task.category || "Study",
    });

    setEditingTaskId(task.id);
    setError("");

    taskFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.setTimeout(() => {
      taskTitleRef.current?.focus();
    }, 400);
  }

  function deleteTask(taskId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== taskId
      )
    );

    if (editingTaskId === taskId) {
      cancelEditing();
    }
  }

  function clearCompletedTasks() {
    const completedCount = tasks.filter(
      (task) => task.completed
    ).length;

    if (completedCount === 0) {
      window.alert("There are no completed tasks.");
      return;
    }

    const shouldClear = window.confirm(
      `Delete ${completedCount} completed task(s)?`
    );

    if (!shouldClear) {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.filter((task) => !task.completed)
    );
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setFormData(initialForm);
    setError("");
  }

  function clearFilters() {
    setSearchTerm("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setCategoryFilter("All");
    setSortOption("Newest");
  }

  function openDashboard() {
    clearFilters();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function openTaskForm() {
    taskFormRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    window.setTimeout(() => {
      taskTitleRef.current?.focus();
    }, 400);
  }

  function openTaskList() {
    taskListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "No due date";
    }

    return new Date(
      `${dateValue}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className={`app ${darkMode ? "dark-mode" : ""}`}>
      <aside className="sidebar">
        <button
          className="logo logo-button"
          onClick={openDashboard}
        >
          <span className="logo-icon">✓</span>
          TaskFlow
        </button>

        <nav className="sidebar-nav">
          <button
            className="nav-item active"
            onClick={openDashboard}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="nav-item"
            onClick={openTaskList}
          >
            <span>☷</span>
            My Tasks
          </button>

          <button
            className="nav-item"
            onClick={openTaskForm}
          >
            <span>＋</span>
            Add Task
          </button>
        </nav>

        <div className="sidebar-message">
          <div className="message-icon">✓</div>
          <h3>Stay organized</h3>
          <p>
            Break down tasks, set priorities, and achieve
            your goals.
          </p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="top-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search tasks, descriptions or categories..."
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />
          </div>

          <div className="topbar-actions">
            <button
              className="theme-button"
              onClick={() =>
                setDarkMode((previousMode) => !previousMode)
              }
              aria-label="Toggle dark mode"
              title="Toggle theme"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            <div className="profile">
              <div className="avatar">D</div>

              <div>
                <strong>Dakshita</strong>
                <span>Stay productive!</span>
              </div>
            </div>
          </div>
        </header>

        <section className="dashboard">
          <section className="hero-section">
            <div>
              <span className="hero-label">
                PRODUCTIVITY DASHBOARD
              </span>

              <h1>Welcome back, Dakshita! 👋</h1>

              <p>
                Stay focused, organize your work and complete
                your goals efficiently.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openTaskForm}
            >
              ＋ Add New Task
            </button>
          </section>

          <div className="stats-grid">
            <StatCard
              icon="📋"
              title="Total Tasks"
              value={statistics.total}
              helper="All created tasks"
              className="total-stat"
            />

            <StatCard
              icon="⏱️"
              title="Pending"
              value={statistics.pending}
              helper="Tasks remaining"
              className="pending-stat"
            />

            <StatCard
              icon="✅"
              title="Completed"
              value={statistics.completed}
              helper="Tasks finished"
              className="completed-stat"
            />

            <StatCard
              icon="⚠️"
              title="Overdue"
              value={statistics.overdue}
              helper="Require attention"
              className="overdue-stat"
            />
          </div>

          <section className="progress-card">
            <div className="progress-heading">
              <div>
                <h2>Overall Progress</h2>

                <p>
                  {statistics.completed} of {statistics.total}{" "}
                  tasks completed
                </p>
              </div>

              <strong>{completionPercentage}%</strong>
            </div>

            <div className="progress-track">
              <div
                className="progress-fill"
                style={{
                  width: `${completionPercentage}%`,
                }}
              />
            </div>
          </section>

          <div className="dashboard-grid">
            <section
              className="card task-form-card"
              ref={taskFormRef}
            >
              <div className="section-title">
                <span className="section-icon">＋</span>

                <div>
                  <h2>
                    {editingTaskId
                      ? "Edit Task"
                      : "Create New Task"}
                  </h2>

                  <p>
                    Add information and organize your work.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Task Title</label>

                <input
                  ref={taskTitleRef}
                  id="title"
                  name="title"
                  type="text"
                  placeholder="What needs to be completed?"
                  value={formData.title}
                  onChange={handleInputChange}
                />

                <label htmlFor="description">
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Add useful details about this task..."
                  value={formData.description}
                  onChange={handleInputChange}
                />

                <div className="form-row">
                  <div>
                    <label htmlFor="dueDate">
                      Due Date
                    </label>

                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="priority">
                      Priority
                    </label>

                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">
                        Medium
                      </option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">
                    Personal
                  </option>
                  <option value="Project">Project</option>
                  <option value="Urgent">Urgent</option>
                </select>

                {error && (
                  <p className="form-error">{error}</p>
                )}

                <button
                  type="submit"
                  className="submit-button"
                >
                  {editingTaskId
                    ? "Save Changes"
                    : "＋ Create Task"}
                </button>

                {editingTaskId && (
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={cancelEditing}
                  >
                    Cancel Editing
                  </button>
                )}
              </form>
            </section>

            <section
              className="card tasks-card"
              ref={taskListRef}
            >
              <div className="tasks-header">
                <div>
                  <h2>Your Tasks</h2>

                  <p className="task-count">
                    Showing {filteredAndSortedTasks.length} of{" "}
                    {tasks.length} tasks
                  </p>
                </div>

                <button
                  type="button"
                  className="clear-completed-button"
                  onClick={clearCompletedTasks}
                >
                  Clear Completed
                </button>
              </div>

              <div className="filters">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(event.target.value)
                  }
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="Overdue">Overdue</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(event) =>
                    setPriorityFilter(event.target.value)
                  }
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(event.target.value)
                  }
                >
                  <option value="All">All Categories</option>
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">
                    Personal
                  </option>
                  <option value="Project">Project</option>
                  <option value="Urgent">Urgent</option>
                </select>

                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value)
                  }
                >
                  <option value="Newest">Newest</option>
                  <option value="Oldest">Oldest</option>
                  <option value="Due Date">
                    Due Date
                  </option>
                  <option value="Priority">
                    Priority
                  </option>
                </select>

                <button
                  type="button"
                  className="clear-filter-button"
                  onClick={clearFilters}
                >
                  Reset
                </button>
              </div>

              <div className="task-list">
                {filteredAndSortedTasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">
                      📝
                    </div>

                    <h3>No tasks found</h3>

                    <p>
                      {tasks.length === 0
                        ? "Create your first task to start organizing your work."
                        : "Try resetting your search and filter options."}
                    </p>

                    {tasks.length > 0 && (
                      <button
                        className="empty-clear-button"
                        onClick={clearFilters}
                      >
                        Reset Filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredAndSortedTasks.map((task) => {
                    const overdue = isTaskOverdue(task);

                    return (
                      <article
                        className={`task-item ${
                          task.completed
                            ? "completed-task"
                            : ""
                        } ${
                          overdue ? "overdue-task" : ""
                        }`}
                        key={task.id}
                      >
                        <input
                          type="checkbox"
                          checked={task.completed}
                          onChange={() =>
                            toggleTaskStatus(task.id)
                          }
                          aria-label={`Update ${task.title}`}
                        />

                        <div className="task-information">
                          <div className="task-title-row">
                            <h3>{task.title}</h3>

                            <span
                              className={`category-badge ${task.category
                                ?.toLowerCase()
                                .replace(" ", "-")}`}
                            >
                              {task.category || "General"}
                            </span>
                          </div>

                          <p>
                            {task.description ||
                              "No description provided"}
                          </p>
                        </div>

                        <span
                          className={`priority-badge ${task.priority.toLowerCase()}`}
                        >
                          {task.priority}
                        </span>

                        <span
                          className={`due-date ${
                            overdue ? "overdue-date" : ""
                          }`}
                        >
                          📅 {formatDate(task.dueDate)}
                        </span>

                        <span
                          className={`status-badge ${
                            task.completed
                              ? "completed"
                              : overdue
                              ? "overdue"
                              : "pending"
                          }`}
                        >
                          {task.completed
                            ? "Completed"
                            : overdue
                            ? "Overdue"
                            : "Pending"}
                        </span>

                        <div className="task-actions">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => editTask(task)}
                            title="Edit task"
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            className="delete-button"
                            onClick={() =>
                              deleteTask(task.id)
                            }
                            title="Delete task"
                          >
                            🗑️
                          </button>
                        </div>
                      </article>
                    );
                  })
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  helper,
  className,
}) {
  return (
    <article className={`stat-card ${className}`}>
      <div className="stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
        <span className="stat-helper">{helper}</span>
      </div>
    </article>
  );
}

export default App;