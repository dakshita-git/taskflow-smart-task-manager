import { useEffect, useMemo, useState } from "react";
import "./App.css";

const initialForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
};

function App() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem("taskflow-tasks");

    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [formData, setFormData] = useState(initialForm);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [error, setError] = useState("");

  useEffect(() => {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
  }, [tasks]);

  const statistics = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter((task) => !task.completed).length,
      completed: tasks.filter((task) => task.completed).length,
      highPriority: tasks.filter(
        (task) => task.priority === "High" && !task.completed
      ).length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Completed" && task.completed) ||
        (statusFilter === "Pending" && !task.completed);

      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  function handleInputChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.title.trim()) {
      setError("Please enter a task title.");
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
                ...formData,
                title: formData.title.trim(),
                description: formData.description.trim(),
              }
            : task
        )
      );

      setEditingTaskId(null);
    } else {
      const newTask = {
        id: crypto.randomUUID(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate,
        priority: formData.priority,
        completed: false,
        createdAt: new Date().toISOString(),
      };

      setTasks((previousTasks) => [newTask, ...previousTasks]);
    }

    setFormData(initialForm);
    setError("");
  }

  function toggleTaskStatus(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  function editTask(task) {
    setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    });

    setEditingTaskId(task.id);
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteTask(taskId) {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!shouldDelete) {
      return;
    }

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId)
    );

    if (editingTaskId === taskId) {
      cancelEditing();
    }
  }

  function cancelEditing() {
    setEditingTaskId(null);
    setFormData(initialForm);
    setError("");
  }

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

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">✓ TaskFlow</div>

        <nav className="sidebar-nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">My Tasks</button>
          <button className="nav-item">Add Task</button>
          <button className="nav-item">Calendar</button>
          <button className="nav-item">Settings</button>
        </nav>

        <div className="sidebar-message">
          <div className="message-icon">✓</div>
          <h3>Stay organized</h3>
          <p>Break down tasks, set priorities, and get things done.</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="top-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className="profile">
            <div className="avatar">D</div>

            <div>
              <strong>Dakshita</strong>
              <span>Stay productive!</span>
            </div>
          </div>
        </header>

        <section className="dashboard">
          <div className="welcome-row">
            <div>
              <h1>Welcome back, Dakshita! 👋</h1>
              <p>Here is what is happening with your tasks today.</p>
            </div>

            <button
              className="primary-button"
              onClick={() =>
                document
                  .querySelector(".task-form-card")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              ＋ Add New Task
            </button>
          </div>

          <div className="stats-grid">
            <StatCard
              icon="📋"
              title="Total Tasks"
              value={statistics.total}
            />

            <StatCard
              icon="⏱️"
              title="Pending Tasks"
              value={statistics.pending}
            />

            <StatCard
              icon="✅"
              title="Completed Tasks"
              value={statistics.completed}
            />

            <StatCard
              icon="🚩"
              title="High Priority"
              value={statistics.highPriority}
            />
          </div>

          <div className="dashboard-grid">
            <section className="card task-form-card">
              <h2>
                {editingTaskId ? "✏️ Edit Task" : "＋ Add New Task"}
              </h2>

              <form onSubmit={handleSubmit}>
                <label htmlFor="title">Task Title</label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  placeholder="Enter task title"
                  value={formData.title}
                  onChange={handleInputChange}
                />

                <label htmlFor="description">Description</label>

                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                  value={formData.description}
                  onChange={handleInputChange}
                />

                <div className="form-row">
                  <div>
                    <label htmlFor="dueDate">Due Date</label>

                    <input
                      id="dueDate"
                      name="dueDate"
                      type="date"
                      value={formData.dueDate}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div>
                    <label htmlFor="priority">Priority</label>

                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>
                </div>

                {error && <p className="form-error">{error}</p>}

                <button type="submit" className="submit-button">
                  {editingTaskId ? "Save Changes" : "＋ Add Task"}
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

            <section className="card tasks-card">
              <div className="tasks-header">
                <div>
                  <h2>Your Tasks</h2>
                  <p className="task-count">
                    Showing {filteredTasks.length} of {tasks.length} tasks
                  </p>
                </div>

                <div className="filters">
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>

                  <select
                    value={priorityFilter}
                    onChange={(event) => setPriorityFilter(event.target.value)}
                  >
                    <option value="All">All Priority</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="task-list">
                {filteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📝</div>
                    <h3>No tasks found</h3>
                    <p>
                      Add a new task or change the search and filter options.
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <article
                      className={`task-item ${
                        task.completed ? "completed-task" : ""
                      }`}
                      key={task.id}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTaskStatus(task.id)}
                        aria-label={`Mark ${task.title} as completed`}
                      />

                      <div className="task-information">
                        <h3>{task.title}</h3>

                        <p>
                          {task.description || "No description provided"}
                        </p>
                      </div>

                      <span
                        className={`priority-badge ${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>

                      <span className="due-date">
                        📅 {formatDate(task.dueDate)}
                      </span>

                      <span
                        className={`status-badge ${
                          task.completed ? "completed" : "pending"
                        }`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>

                      <div className="task-actions">
                        <button
                          className="edit-button"
                          onClick={() => editTask(task)}
                          aria-label={`Edit ${task.title}`}
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => deleteTask(task.id)}
                          aria-label={`Delete ${task.title}`}
                        >
                          🗑️
                        </button>
                      </div>
                    </article>
                  ))
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">{icon}</div>

      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </article>
  );
}

export default App;