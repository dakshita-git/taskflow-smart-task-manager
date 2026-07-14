import { useLocation, useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

const pageInformation = {
  "/dashboard": {
    title: "Dashboard",
    subtitle: "Monitor your productivity and recent tasks.",
  },
  "/tasks": {
    title: "My Tasks",
    subtitle: "Search, organize and manage all your tasks.",
  },
  "/add-task": {
    title: "Create Task",
    subtitle: "Add a new task to your workspace.",
  },
  "/calendar": {
    title: "Calendar",
    subtitle: "View upcoming tasks based on due dates.",
  },
  "/settings": {
    title: "Settings",
    subtitle: "Manage your workspace preferences.",
  },
};

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, setDarkMode } = useTasks();

  const currentPage =
    pageInformation[location.pathname] || pageInformation["/dashboard"];

  return (
    <header className="app-header">
      <div>
        <h1>{currentPage.title}</h1>
        <p>{currentPage.subtitle}</p>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="header-icon-button"
          onClick={() => setDarkMode((previousMode) => !previousMode)}
          title="Toggle theme"
        >
          {darkMode ? "☀" : "☾"}
        </button>

        <button
          type="button"
          className="header-add-button"
          onClick={() => navigate("/add-task")}
        >
          ＋ New Task
        </button>
      </div>
    </header>
  );
}

export default Header;