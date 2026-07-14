import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: "⌂",
  },
  {
    path: "/tasks",
    label: "My Tasks",
    icon: "☷",
  },
  {
    path: "/add-task",
    label: "Add Task",
    icon: "＋",
  },
  {
    path: "/calendar",
    label: "Calendar",
    icon: "▣",
  },
  {
    path: "/settings",
    label: "Settings",
    icon: "⚙",
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar-logo">
        <span className="logo-mark">✓</span>

        <div>
          <strong>TaskFlow</strong>
          <small>Smart Productivity</small>
        </div>
      </NavLink>

      <nav className="sidebar-navigation">
        <span className="navigation-label">WORKSPACE</span>

        {navigationItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? "active" : ""}`
            }
          >
            <span className="sidebar-link-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-productivity-card">
        <div className="productivity-icon">⚡</div>
        <h3>Stay productive</h3>
        <p>Small progress every day leads to big results.</p>
      </div>

      <div className="sidebar-profile">
        <div className="profile-avatar">D</div>

        <div>
          <strong>Dakshita Pal</strong>
          <span>TaskFlow user</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;