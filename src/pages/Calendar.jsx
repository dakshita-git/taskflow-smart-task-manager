import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function Calendar() {
  const navigate = useNavigate();
  const { tasks, toggleTask, isTaskOverdue } = useTasks();

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const result = [];

    for (let index = 0; index < firstDay; index += 1) {
      result.push(null);
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      result.push(day);
    }

    return result;
  }, [year, month]);

  const monthTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!task.dueDate) {
        return false;
      }

      const dueDate = new Date(`${task.dueDate}T00:00:00`);

      return (
        dueDate.getFullYear() === year &&
        dueDate.getMonth() === month
      );
    });
  }, [tasks, year, month]);

  const upcomingTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return tasks
      .filter((task) => {
        if (!task.dueDate || task.completed) {
          return false;
        }

        const dueDate = new Date(
          `${task.dueDate}T00:00:00`
        );

        return dueDate >= today;
      })
      .sort(
        (firstTask, secondTask) =>
          new Date(firstTask.dueDate) -
          new Date(secondTask.dueDate)
      )
      .slice(0, 5);
  }, [tasks]);

  function getTasksForDay(day) {
    if (!day) {
      return [];
    }

    return monthTasks.filter((task) => {
      const dueDate = new Date(`${task.dueDate}T00:00:00`);
      return dueDate.getDate() === day;
    });
  }

  function previousMonth() {
    setCurrentDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1));
  }

  function goToToday() {
    setCurrentDate(new Date());
  }

  function isToday(day) {
    const today = new Date();

    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  }

  function formatDate(dateValue) {
    return new Date(
      `${dateValue}T00:00:00`
    ).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="calendar-page">
      <section className="calendar-intro">
        <div>
          <span className="page-eyebrow">
            DEADLINE PLANNER
          </span>

          <h2>See your month at a glance</h2>

          <p>
            Review deadlines, upcoming work and completed tasks
            using the calendar view.
          </p>
        </div>

        <button
          type="button"
          className="tasks-create-button"
          onClick={() => navigate("/add-task")}
        >
          ＋ Add Task
        </button>
      </section>

      <div className="calendar-layout">
        <section className="calendar-main-card">
          <div className="calendar-toolbar">
            <div>
              <span className="panel-label">CURRENT MONTH</span>

              <h3>
                {currentDate.toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })}
              </h3>
            </div>

            <div className="calendar-toolbar-actions">
              <button type="button" onClick={previousMonth}>
                ←
              </button>

              <button
                type="button"
                className="calendar-today-button"
                onClick={goToToday}
              >
                Today
              </button>

              <button type="button" onClick={nextMonth}>
                →
              </button>
            </div>
          </div>

          <div className="calendar-week-header">
            {weekDays.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          <div className="calendar-grid">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDay(day);

              return (
                <div
                  className={`calendar-day ${
                    !day ? "calendar-empty-day" : ""
                  } ${isToday(day) ? "calendar-today" : ""}`}
                  key={`${day}-${index}`}
                >
                  {day && (
                    <>
                      <span className="calendar-day-number">
                        {day}
                      </span>

                      <div className="calendar-day-tasks">
                        {dayTasks.slice(0, 3).map((task) => (
                          <button
                            type="button"
                            key={task.id}
                            className={`calendar-task-chip priority-border-${task.priority.toLowerCase()} ${
                              task.completed
                                ? "calendar-task-completed"
                                : ""
                            }`}
                            onClick={() =>
                              navigate(`/add-task?edit=${task.id}`)
                            }
                            title={task.title}
                          >
                            {task.title}
                          </button>
                        ))}

                        {dayTasks.length > 3 && (
                          <span className="calendar-more-tasks">
                            +{dayTasks.length - 3} more
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <aside className="calendar-sidebar">
          <section className="calendar-summary-card">
            <span className="panel-label">
              MONTHLY SUMMARY
            </span>

            <h3>{monthTasks.length} scheduled tasks</h3>

            <div className="calendar-summary-list">
              <SummaryItem
                label="Completed"
                value={
                  monthTasks.filter((task) => task.completed)
                    .length
                }
                variant="green"
              />

              <SummaryItem
                label="Pending"
                value={
                  monthTasks.filter(
                    (task) =>
                      !task.completed &&
                      !isTaskOverdue(task)
                  ).length
                }
                variant="orange"
              />

              <SummaryItem
                label="Overdue"
                value={
                  monthTasks.filter(isTaskOverdue).length
                }
                variant="red"
              />
            </div>
          </section>

          <section className="upcoming-deadlines-card">
            <div className="panel-heading">
              <div>
                <span className="panel-label">NEXT UP</span>
                <h3>Upcoming deadlines</h3>
              </div>
            </div>

            {upcomingTasks.length === 0 ? (
              <div className="small-empty-state">
                <span>◫</span>
                <p>No upcoming deadlines.</p>
              </div>
            ) : (
              <div className="calendar-upcoming-list">
                {upcomingTasks.map((task) => (
                  <article
                    className="calendar-upcoming-item"
                    key={task.id}
                  >
                    <button
                      type="button"
                      className={`task-completion-button ${
                        task.completed
                          ? "task-completion-checked"
                          : ""
                      }`}
                      onClick={() => toggleTask(task.id)}
                    >
                      {task.completed ? "✓" : ""}
                    </button>

                    <div>
                      <h4>{task.title}</h4>
                      <span>{formatDate(task.dueDate)}</span>
                    </div>

                    <span
                      className={`mini-priority-badge priority-${task.priority.toLowerCase()}`}
                    >
                      {task.priority}
                    </span>
                  </article>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function SummaryItem({ label, value, variant }) {
  return (
    <div className="calendar-summary-item">
      <span className={`summary-indicator summary-${variant}`} />

      <p>{label}</p>

      <strong>{value}</strong>
    </div>
  );
}

export default Calendar;