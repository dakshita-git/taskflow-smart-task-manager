import { useState } from "react";
import { useTasks } from "../context/TaskContext";

function Settings() {
  const {
    tasks,
    darkMode,
    setDarkMode,
    statistics,
    deleteAllTasks,
  } = useTasks();

  const [compactMode, setCompactMode] = useState(() => {
    return localStorage.getItem("taskflow-compact") === "true";
  });

  const [showCompleted, setShowCompleted] = useState(() => {
    return (
      localStorage.getItem("taskflow-show-completed") !==
      "false"
    );
  });

  const [message, setMessage] = useState("");

  function updateCompactMode(value) {
    setCompactMode(value);
    localStorage.setItem(
      "taskflow-compact",
      String(value)
    );

    document.body.classList.toggle(
      "compact-interface",
      value
    );

    showMessage("Interface preference saved.");
  }

  function updateCompletedPreference(value) {
    setShowCompleted(value);

    localStorage.setItem(
      "taskflow-show-completed",
      String(value)
    );

    showMessage("Task display preference saved.");
  }

  function showMessage(text) {
    setMessage(text);

    window.setTimeout(() => {
      setMessage("");
    }, 2200);
  }

  function handleDeleteAllTasks() {
    if (tasks.length === 0) {
      window.alert("There are no tasks to delete.");
      return;
    }

    const confirmation = window.prompt(
      'This will permanently delete every task. Type "DELETE" to continue.'
    );

    if (confirmation !== "DELETE") {
      return;
    }

    deleteAllTasks();
    showMessage("All task data was deleted.");
  }

  function exportTasks() {
    if (tasks.length === 0) {
      window.alert("There are no tasks to export.");
      return;
    }

    const fileContent = JSON.stringify(tasks, null, 2);
    const blob = new Blob([fileContent], {
      type: "application/json",
    });

    const downloadUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = "taskflow-tasks.json";
    link.click();

    URL.revokeObjectURL(downloadUrl);
    showMessage("Task data exported successfully.");
  }

  return (
    <div className="settings-page">
      <section className="settings-intro">
        <div>
          <span className="page-eyebrow">
            WORKSPACE PREFERENCES
          </span>

          <h2>Make TaskFlow work your way</h2>

          <p>
            Customize the interface and manage your locally
            stored task data.
          </p>
        </div>

        <div className="settings-status">
          <span>✓</span>

          <div>
            <strong>Local workspace</strong>
            <small>
              Your information stays inside this browser
            </small>
          </div>
        </div>
      </section>

      {message && (
        <div className="settings-success-message">
          ✓ {message}
        </div>
      )}

      <div className="settings-layout">
        <div className="settings-main-column">
          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">◐</div>

              <div>
                <h3>Appearance</h3>
                <p>
                  Select the appearance of your workspace.
                </p>
              </div>
            </div>

            <div className="theme-option-grid">
              <button
                type="button"
                className={`theme-option ${
                  !darkMode ? "selected-theme" : ""
                }`}
                onClick={() => {
                  setDarkMode(false);
                  showMessage("Light theme enabled.");
                }}
              >
                <div className="light-theme-preview">
                  <span />
                  <span />
                  <span />
                </div>

                <strong>Light</strong>
                <small>Bright and minimal</small>
              </button>

              <button
                type="button"
                className={`theme-option ${
                  darkMode ? "selected-theme" : ""
                }`}
                onClick={() => {
                  setDarkMode(true);
                  showMessage("Dark theme enabled.");
                }}
              >
                <div className="dark-theme-preview">
                  <span />
                  <span />
                  <span />
                </div>

                <strong>Dark</strong>
                <small>Comfortable in low light</small>
              </button>
            </div>
          </section>

          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">⚙</div>

              <div>
                <h3>Task preferences</h3>
                <p>
                  Configure how the task workspace behaves.
                </p>
              </div>
            </div>

            <PreferenceRow
              title="Compact interface"
              description="Reduce spacing to display more information."
              checked={compactMode}
              onChange={updateCompactMode}
            />

            <PreferenceRow
              title="Show completed tasks"
              description="Keep completed tasks visible in the workspace."
              checked={showCompleted}
              onChange={updateCompletedPreference}
            />
          </section>

          <section className="settings-card">
            <div className="settings-card-heading">
              <div className="settings-heading-icon">⇩</div>

              <div>
                <h3>Data management</h3>
                <p>
                  Export or permanently remove your local data.
                </p>
              </div>
            </div>

            <div className="data-action-row">
              <div>
                <strong>Export task data</strong>
                <p>
                  Download all tasks as a JSON backup file.
                </p>
              </div>

              <button
                type="button"
                className="settings-export-button"
                onClick={exportTasks}
              >
                Export Data
              </button>
            </div>

            <div className="data-action-row danger-data-row">
              <div>
                <strong>Delete all tasks</strong>
                <p>
                  Permanently remove every task from this
                  browser.
                </p>
              </div>

              <button
                type="button"
                className="settings-delete-button"
                onClick={handleDeleteAllTasks}
              >
                Delete All
              </button>
            </div>
          </section>
        </div>

        <aside className="settings-sidebar">
          <section className="workspace-summary-card">
            <span className="panel-label">
              WORKSPACE SUMMARY
            </span>

            <div className="workspace-summary-icon">▤</div>

            <h3>{statistics.total} total tasks</h3>

            <p>
              TaskFlow currently stores all task information in
              your browser using localStorage.
            </p>

            <div className="workspace-stat-list">
              <div>
                <span>Completed</span>
                <strong>{statistics.completed}</strong>
              </div>

              <div>
                <span>Pending</span>
                <strong>{statistics.pending}</strong>
              </div>

              <div>
                <span>Overdue</span>
                <strong>{statistics.overdue}</strong>
              </div>
            </div>
          </section>

          <section className="settings-information-card">
            <div className="information-icon">i</div>

            <div>
              <h3>About local storage</h3>

              <p>
                Data remains after refreshing, but it is not
                shared across devices or browsers.
              </p>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="preference-row">
      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

      <button
        type="button"
        className={`toggle-switch ${
          checked ? "toggle-active" : ""
        }`}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
      >
        <span />
      </button>
    </div>
  );
}

export default Settings;