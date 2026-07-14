import { Outlet } from "react-router-dom";
import { useTasks } from "../context/TaskContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout() {
  const { darkMode } = useTasks();

  return (
    <div className={`app-shell ${darkMode ? "dark-mode" : ""}`}>
      <Sidebar />

      <div className="content-shell">
        <Header />

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;