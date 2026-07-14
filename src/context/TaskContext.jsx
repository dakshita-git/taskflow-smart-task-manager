import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const TaskContext = createContext(null);

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

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("taskflow-tasks");

      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Unable to load saved tasks:", error);
      return [];
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("taskflow-theme") === "dark";
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        "taskflow-tasks",
        JSON.stringify(tasks)
      );
    } catch (error) {
      console.error("Unable to save tasks:", error);
    }
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

  function addTask(taskData) {
    const newTask = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()}`,

      title: taskData.title.trim(),
      description: taskData.description.trim(),
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      category: taskData.category,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setTasks((previousTasks) => [
      newTask,
      ...previousTasks,
    ]);

    return newTask;
  }

  function updateTask(taskId, taskData) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              title: taskData.title.trim(),
              description: taskData.description.trim(),
              dueDate: taskData.dueDate,
              priority: taskData.priority,
              category: taskData.category,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }

  function toggleTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              updatedAt: new Date().toISOString(),
            }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => task.id !== taskId
      )
    );
  }

  function clearCompletedTasks() {
    setTasks((previousTasks) =>
      previousTasks.filter(
        (task) => !task.completed
      )
    );
  }

  function deleteAllTasks() {
    setTasks([]);
  }

  const statistics = useMemo(() => {
    const total = tasks.length;

    const completed = tasks.filter(
      (task) => task.completed
    ).length;

    const pending = tasks.filter(
      (task) => !task.completed
    ).length;

    const overdue = tasks.filter(
      isTaskOverdue
    ).length;

    const highPriority = tasks.filter(
      (task) =>
        task.priority === "High" &&
        !task.completed
    ).length;

    return {
      total,
      completed,
      pending,
      overdue,
      highPriority,

      completionPercentage:
        total === 0
          ? 0
          : Math.round(
              (completed / total) * 100
            ),
    };
  }, [tasks]);

  const value = {
    tasks,
    darkMode,
    statistics,
    initialForm,
    priorityWeight,

    addTask,
    updateTask,
    toggleTask,
    deleteTask,
    clearCompletedTasks,
    deleteAllTasks,
    isTaskOverdue,
    setDarkMode,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error(
      "useTasks must be used inside TaskProvider"
    );
  }

  return context;
}