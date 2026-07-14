# AI Journal — TaskFlow Project

## Project Overview

TaskFlow is a multi-page task management application built using React, Vite, React Router, Context API, CSS, and browser `localStorage`.

The project was developed as part of a Vibe Coding Assessment. The main goal was not only to build a working application, but also to show planning, AI-assisted development, problem-solving, iteration, Git workflow, and documentation.

---

## Phase 1: Understanding the Assessment

I first reviewed the complete assessment document to understand what was expected.

The assessment focused on:

1. Planning and architecture
2. AI usage
3. Git commit history
4. Problem-solving
5. Progressive development
6. Code quality
7. Documentation
8. Final reflection
9. Working application
10. Deployment and video walkthrough

After understanding the requirements, I decided to build a task management application because it could demonstrate useful real-world functionality within the available deadline.

I named the project:

> **TaskFlow – Smart Task Management Application**

---

## Phase 2: Project Planning

Before starting development, I prepared the project planning document.

The planning included:

1. Problem statement
2. Application overview
3. Target users
4. Main features
5. Technical stack
6. Technical architecture
7. Task data structure
8. Development milestones
9. Success criteria
10. Future improvements

The planning document was created before the main application code so that the repository clearly showed that planning happened first.

**File created:**

```text
docs/planning.md
```

---

## Phase 3: Git and Project Setup

I created the React project using Vite and connected it to a public GitHub repository.

During setup, Git showed the following error:

```
fatal: pathspec 'docs/planning.md' did not match any files
```

The file had not been created in the correct location.

I fixed the issue by:

1. Checking the current project folder
2. Creating the `docs` directory
3. Creating `planning.md`
4. Committing the planning file first
5. Committing the React setup separately
6. Pushing both commits to GitHub

---

## Phase 4: Initial Dashboard

The first version was a single-page dashboard. It included:

1. Sidebar
2. Header
3. Task statistics
4. Add-task form
5. Search
6. Status filter
7. Priority filter
8. Task list

At this stage, the interface was mainly visual.

---

## Phase 5: Core Task Functionality

I added the main task-management features:

1. Create task
2. Edit task
3. Delete task
4. Mark task as completed
5. Reopen completed task
6. Search tasks
7. Filter tasks
8. Form validation
9. Dashboard statistics
10. `localStorage` persistence

Tasks remained available after refreshing the browser.

---

## Phase 6: Navigation and Search Fixes

During testing, I found that the following controls were not working:

1. Dashboard
2. My Tasks
3. Add Task
4. Add New Task

I added working navigation behaviour, input focus, scrolling, and filter reset controls.

Search also appeared incorrect when active filters hid matching tasks. A reset option was added to make the behaviour clear.

---

## Phase 7: Advanced Features

To improve the application beyond basic CRUD functionality, I added:

1. Task categories
2. Sorting
3. Overdue detection
4. Completion percentage
5. Progress bar
6. Dark mode
7. Clear completed tasks
8. Improved priority and status badges

The single-page layout became crowded after these features were added.

---

## Phase 8: Multi-Page Refactoring

I refactored the application using React Router.

**Final routes:**

1. `/dashboard`
2. `/tasks`
3. `/add-task`
4. `/calendar`
5. `/settings`

**Shared components created:**

1. Shared Sidebar
2. Shared Header
3. Layout component
4. Task Context
5. Reusable TaskCard
6. Reusable StatCard

Context API was used to share task data across all pages.

---

## Phase 9: Final Pages

### 9.1 Dashboard

The Dashboard includes:

1. Total tasks
2. Pending tasks
3. Completed tasks
4. Overdue tasks
5. Completion progress
6. Priority overview
7. Recent tasks
8. Upcoming deadlines
9. Quick actions

### 9.2 My Tasks

The My Tasks page includes:

1. Search
2. Status filter
3. Priority filter
4. Category filter
5. Sorting
6. Edit
7. Delete
8. Complete
9. Reset filters
10. Clear completed tasks

### 9.3 Add Task

The Add Task page supports:

1. Creating tasks
2. Editing tasks
3. Validation
4. Live preview
5. Reset
6. Cancel

### 9.4 Calendar

The Calendar includes:

1. Monthly view
2. Previous and next month
3. Today button
4. Tasks on due dates
5. Monthly summary
6. Upcoming deadlines

### 9.5 Settings

The Settings page includes:

1. Light mode
2. Dark mode
3. Compact interface option
4. Workspace statistics
5. JSON export
6. Delete all tasks

---

## Phase 10: Backend Decision

I considered adding Node.js, Express.js, MongoDB, REST APIs, and authentication.

Because of the limited deadline, I decided to complete a stable frontend MVP using `localStorage`. Backend development was kept as a future improvement.

---

## Phase 11: Testing

**Manually tested:**

1. All routes
2. Task creation
3. Task editing
4. Task deletion
5. Completion toggle
6. Search
7. Filters
8. Sorting
9. Dashboard statistics
10. Overdue detection
11. Calendar navigation
12. Dark mode
13. JSON export
14. Delete all tasks
15. `localStorage` persistence
16. Responsive layout

**Also ran:**

```
npm run build
npm run preview
```

---

## Phase 12: Documentation

The final documentation includes:

1. `README.md`
2. `docs/planning.md`
3. `docs/ai-journal.md`
4. `docs/progress-log.md`
5. `docs/reflection.md`

---

## Main Challenges and Solutions

| # | Challenge | Solution |
|---|-----------|----------|
| 1 | **Git File Error** — the planning file was missing from the expected folder | Created it correctly and preserved the required commit order |
| 2 | **Non-Functional Controls** — some buttons were visual only | Added event handlers and later replaced them with React Router navigation |
| 3 | **Search Confusion** — active filters hid matching tasks | Added a clear reset option |
| 4 | **Crowded Layout** — the single-page application became difficult to manage | Refactored it into separate pages |
| 5 | **Backend Scope** — a complete backend could delay submission | Completed the frontend MVP and documented backend work as a future improvement |

---

## Final Result

The final TaskFlow application includes:

1. Multi-page navigation
2. Task CRUD operations
3. Search
4. Filters
5. Sorting
6. Categories
7. Priorities
8. Overdue detection
9. Dashboard statistics
10. Progress tracking
11. Calendar
12. Dark mode
13. JSON export
14. `localStorage` persistence
15. Responsive design