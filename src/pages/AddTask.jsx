import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTasks } from "../context/TaskContext";

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  category: "Study",
};

function AddTask() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { tasks, addTask, updateTask } = useTasks();

  const editingTaskId = searchParams.get("edit");
  const isEditing = Boolean(editingTaskId);

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    if (!editingTaskId) {
      setFormData(emptyForm);
      return;
    }

    const taskToEdit = tasks.find(
      (task) => task.id === editingTaskId
    );

    if (!taskToEdit) {
      navigate("/tasks", { replace: true });
      return;
    }

    setFormData({
      title: taskToEdit.title || "",
      description: taskToEdit.description || "",
      dueDate: taskToEdit.dueDate || "",
      priority: taskToEdit.priority || "Medium",
      category: taskToEdit.category || "Study",
    });
  }, [editingTaskId, tasks, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previousErrors) => ({
        ...previousErrors,
        [name]: "",
      }));
    }

    setSavedMessage("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Task title is required.";
    }

    if (!formData.dueDate) {
      newErrors.dueDate = "Please select a due date.";
    }

    if (formData.title.trim().length > 80) {
      newErrors.title =
        "Task title should be less than 80 characters.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (isEditing) {
      updateTask(editingTaskId, formData);
      setSavedMessage("Task updated successfully.");
    } else {
      addTask(formData);
      setSavedMessage("Task created successfully.");
      setFormData(emptyForm);
    }

    window.setTimeout(() => {
      navigate("/tasks");
    }, 700);
  }

  function resetForm() {
    if (isEditing) {
      const existingTask = tasks.find(
        (task) => task.id === editingTaskId
      );

      if (existingTask) {
        setFormData({
          title: existingTask.title || "",
          description: existingTask.description || "",
          dueDate: existingTask.dueDate || "",
          priority: existingTask.priority || "Medium",
          category: existingTask.category || "Study",
        });
      }
    } else {
      setFormData(emptyForm);
    }

    setErrors({});
    setSavedMessage("");
  }

  return (
    <div className="add-task-page">
      <section className="add-task-intro">
        <div>
          <span className="page-eyebrow">
            {isEditing ? "UPDATE WORK" : "NEW WORK"}
          </span>

          <h2>
            {isEditing
              ? "Update your task"
              : "Turn your plan into action"}
          </h2>

          <p>
            Add clear details, select a priority and set a
            realistic deadline.
          </p>
        </div>

        <div className="add-task-progress">
          <div className="add-task-progress-icon">✓</div>

          <div>
            <strong>
              {isEditing ? "Edit mode" : "Create mode"}
            </strong>
            <span>
              {isEditing
                ? "Modify the task information"
                : "Complete the form to add a task"}
            </span>
          </div>
        </div>
      </section>

      <div className="add-task-layout">
        <section className="task-editor-card">
          <div className="task-editor-heading">
            <div className="task-editor-icon">
              {isEditing ? "✎" : "＋"}
            </div>

            <div>
              <h3>
                {isEditing ? "Edit Task" : "Task Information"}
              </h3>
              <p>
                Fields marked with an asterisk are required.
              </p>
            </div>
          </div>

          <form
            className="professional-task-form"
            onSubmit={handleSubmit}
          >
            <div className="form-field">
              <label htmlFor="title">
                Task title <span>*</span>
              </label>

              <input
                id="title"
                name="title"
                type="text"
                placeholder="For example: Complete internship assessment"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? "field-error" : ""}
                autoFocus
              />

              <div className="field-information">
                <small>
                  {errors.title ||
                    "Use a short and meaningful title."}
                </small>

                <span>{formData.title.length}/80</span>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="description">
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Add details, important steps or useful notes..."
                value={formData.description}
                onChange={handleChange}
                rows="6"
              />

              <small>
                Optional, but useful for adding context.
              </small>
            </div>

            <div className="task-form-grid">
              <div className="form-field">
                <label htmlFor="dueDate">
                  Due date <span>*</span>
                </label>

                <input
                  id="dueDate"
                  name="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className={
                    errors.dueDate ? "field-error" : ""
                  }
                />

                {errors.dueDate && (
                  <small className="error-text">
                    {errors.dueDate}
                  </small>
                )}
              </div>

              <div className="form-field">
                <label htmlFor="priority">Priority</label>

                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="Low">Low priority</option>
                  <option value="Medium">
                    Medium priority
                  </option>
                  <option value="High">High priority</option>
                </select>
              </div>

              <div className="form-field">
                <label htmlFor="category">Category</label>

                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="Study">Study</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Project">Project</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>
            </div>

            {savedMessage && (
              <div className="task-success-message">
                ✓ {savedMessage}
              </div>
            )}

            <div className="task-form-actions">
              <button
                type="button"
                className="secondary-form-button"
                onClick={() => navigate("/tasks")}
              >
                Cancel
              </button>

              <button
                type="button"
                className="secondary-form-button"
                onClick={resetForm}
              >
                Reset
              </button>

              <button
                type="submit"
                className="primary-form-button"
              >
                {isEditing ? "Save Changes" : "＋ Create Task"}
              </button>
            </div>
          </form>
        </section>

        <aside className="task-form-sidebar">
          <section className="form-preview-card">
            <span className="panel-label">LIVE PREVIEW</span>
            <h3>{formData.title || "Your task title"}</h3>

            <p>
              {formData.description ||
                "Task description will appear here."}
            </p>

            <div className="preview-badges">
              <span
                className={`task-priority-pill priority-${formData.priority.toLowerCase()}`}
              >
                {formData.priority}
              </span>

              <span
                className={`task-category-pill category-${formData.category.toLowerCase()}`}
              >
                {formData.category}
              </span>
            </div>

            <div className="preview-due-date">
              <span>◫</span>
              {formData.dueDate
                ? new Date(
                    `${formData.dueDate}T00:00:00`
                  ).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })
                : "No due date selected"}
            </div>
          </section>

          <section className="task-tips-card">
            <div className="tips-icon">⚡</div>

            <h3>Tips for better tasks</h3>

            <ul>
              <li>Use an action-oriented task title.</li>
              <li>Add a realistic completion date.</li>
              <li>Use high priority only when necessary.</li>
              <li>Add useful details in the description.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

export default AddTask;