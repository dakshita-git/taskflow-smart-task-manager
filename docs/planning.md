# TaskFlow – Project Planning

## 1. Project Idea

TaskFlow is a task management application that helps users organize their daily work, track deadlines, and manage priorities from one place.

The main reason behind choosing this project was that task management is a common real-life problem. Students, working professionals, and freelancers often need a simple system to keep track of what they have to do and when they have to finish it.

I also wanted to build something that could demonstrate useful frontend concepts such as routing, state management, data persistence, filtering, sorting, responsive design, and user interaction.

---

## 2. Problem Statement

People often manage tasks using notebooks, scattered notes, reminders, or different applications. This makes it easy to forget deadlines or lose track of important work.

The goal of TaskFlow is to provide a clean and easy-to-use workspace where users can:

1. Create tasks
2. Set priorities
3. Add deadlines
4. Organize tasks by category
5. Track completed and pending work
6. View overdue tasks
7. Search and filter tasks
8. Review tasks on a calendar

---

## 3. Target Users

TaskFlow can be useful for:

1. Students managing assignments and study plans
2. Working professionals tracking daily work
3. Freelancers managing multiple responsibilities
4. Anyone who wants a simple personal productivity tool

---

## 4. Application Overview

TaskFlow is a multi-page React application.

The application includes:

1. Dashboard
2. My Tasks
3. Add Task
4. Calendar
5. Settings

All task data is stored in the browser using `localStorage`. This keeps the application lightweight and allows the data to remain available after refreshing the page.

---

## 5. Main Features

### 5.1 Dashboard

1. Total task count
2. Pending task count
3. Completed task count
4. Overdue task count
5. Completion percentage
6. Priority overview
7. Recent tasks
8. Upcoming deadlines
9. Quick actions

### 5.2 My Tasks

1. View all tasks
2. Search tasks
3. Filter by status
4. Filter by priority
5. Filter by category
6. Sort by newest, oldest, due date, or priority
7. Mark tasks as completed
8. Edit tasks
9. Delete tasks
10. Clear completed tasks

### 5.3 Add Task

1. Add task title
2. Add description
3. Select due date
4. Select priority
5. Select category
6. Form validation
7. Live task preview
8. Edit existing tasks

### 5.4 Calendar

1. Monthly calendar view
2. Previous and next month navigation
3. Today button
4. Tasks shown on their due dates
5. Monthly summary
6. Upcoming deadline list

### 5.5 Settings

1. Light mode
2. Dark mode
3. Compact interface option
4. Completed-task preference
5. Export task data
6. Delete all task data

---

## 6. Technical Stack

1. React
2. React Router DOM
3. JavaScript
4. Vite
5. CSS
6. Context API
7. Browser `localStorage`
8. Git and GitHub
9. Vercel for deployment

---

## 7. Technical Architecture

The application follows a component-based structure.

```text
React Application
│
├── Layout
│   ├── Sidebar
│   └── Header
│
├── Pages
│   ├── Dashboard
│   ├── Tasks
│   ├── Add Task
│   ├── Calendar
│   └── Settings
│
├── Shared Components
│   ├── Stat Card
│   └── Task Card
│
└── Task Context
    ├── Task state
    ├── Task actions
    ├── Statistics
    └── localStorage handling
```

---

## 8. Project Structure

```text
src/
├── components/
│   ├── Header.jsx
│   ├── Layout.jsx
│   ├── Sidebar.jsx
│   ├── StatCard.jsx
│   └── TaskCard.jsx
│
├── context/
│   └── TaskContext.jsx
│
├── pages/
│   ├── Dashboard.jsx
│   ├── Tasks.jsx
│   ├── AddTask.jsx
│   ├── Calendar.jsx
│   └── Settings.jsx
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

---

## 9. Development and Deployment

1. Git
2. GitHub
3. npm
4. Vercel