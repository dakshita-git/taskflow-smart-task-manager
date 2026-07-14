import "./App.css";

const sampleTasks = [
  {
    id: 1,
    title: "Build TaskFlow Dashboard",
    description: "Create the main dashboard UI",
    priority: "High",
    dueDate: "15 Jul 2026",
    completed: false,
  },
  {
    id: 2,
    title: "Add Local Storage",
    description: "Save tasks inside the browser",
    priority: "Medium",
    dueDate: "16 Jul 2026",
    completed: false,
  },
  {
    id: 3,
    title: "Set up React Project",
    description: "Initialize the project using Vite",
    priority: "Low",
    dueDate: "13 Jul 2026",
    completed: true,
  },
];

function App() {
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
            <input type="text" placeholder="Search tasks..." />
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

            <button className="primary-button">＋ Add New Task</button>
          </div>

          <div className="stats-grid">
            <StatCard icon="📋" title="Total Tasks" value="8" />
            <StatCard icon="⏱️" title="Pending Tasks" value="5" />
            <StatCard icon="✅" title="Completed Tasks" value="3" />
            <StatCard icon="🚩" title="High Priority" value="2" />
          </div>

          <div className="dashboard-grid">
            <section className="card task-form-card">
              <h2>＋ Add New Task</h2>

              <form>
                <label htmlFor="title">Task Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="Enter task title"
                />

                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  placeholder="Enter task description"
                />

                <div className="form-row">
                  <div>
                    <label htmlFor="dueDate">Due Date</label>
                    <input id="dueDate" type="date" />
                  </div>

                  <div>
                    <label htmlFor="priority">Priority</label>
                    <select id="priority">
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                </div>

                <button type="button" className="submit-button">
                  ＋ Add Task
                </button>
              </form>
            </section>

            <section className="card tasks-card">
              <div className="tasks-header">
                <h2>Your Tasks</h2>

                <div className="filters">
                  <input type="text" placeholder="Search tasks..." />

                  <select>
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Completed</option>
                  </select>

                  <select>
                    <option>All Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="task-list">
                {sampleTasks.map((task) => (
                  <article
                    className={`task-item ${
                      task.completed ? "completed-task" : ""
                    }`}
                    key={task.id}
                  >
                    <input type="checkbox" checked={task.completed} readOnly />

                    <div className="task-information">
                      <h3>{task.title}</h3>
                      <p>{task.description}</p>
                    </div>

                    <span
                      className={`priority-badge ${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>

                    <span className="due-date">📅 {task.dueDate}</span>

                    <span
                      className={`status-badge ${
                        task.completed ? "completed" : "pending"
                      }`}
                    >
                      {task.completed ? "Completed" : "Pending"}
                    </span>

                    <button className="menu-button">⋮</button>
                  </article>
                ))}
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