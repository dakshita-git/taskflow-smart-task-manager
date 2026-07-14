# TaskFlow – AI-Assisted Development Journal

## 1. Overview

This journal documents how AI was used while planning, developing, debugging, improving, testing, and documenting TaskFlow.

The primary AI tool used was ChatGPT.

The prompts below are cleaned-up versions of the actual prompts used during development. They preserve the original goal and technical requirements while removing repeated messages.

---

## 2. AI Tool Used

### Tool

ChatGPT

### Areas of Use

- Assessment analysis
- Project selection
- Planning
- Architecture
- UI design
- React development
- State management
- Routing
- localStorage
- Debugging
- Git guidance
- Testing
- Documentation

---

## 3. Prompting Approach

I divided the project into smaller stages instead of asking AI to generate the entire application at once.

Most prompts included:

- Current project status
- Problem to solve
- Technical constraints
- Expected output
- Features that must remain unchanged
- Testing requirements

This made the generated output easier to review, implement, and test.

---

# Phase 1: Assessment Analysis and Project Selection

## 4. Understanding the Assessment

### Goal

Understand the mandatory requirements, evaluation criteria, and final submission format.

### Prompt

> Analyse the attached Vibe Coder Assessment as a technical evaluator.
>
> Explain:
> - What application must be built
> - Which documentation files are mandatory
> - What should be committed before development
> - How Git history will be evaluated
> - What the final submission should contain
> - Which evaluation areas carry the highest weight
>
> Separate mandatory work from bonus work and provide a practical one-day execution plan.

### AI Contribution

The AI explained that the assessment focused on:

- Planning
- AI usage
- Git workflow
- Problem-solving
- Progressive development
- Documentation
- Working functionality

### Decision

I decided to focus on a stable application, meaningful commits, visible iteration, and complete documentation.

---

## 5. Selecting the Project Idea

### Goal

Choose a project that could be completed within one day while still demonstrating useful functionality.

### Prompt

> Compare Task Management App, Expense Tracker, Appointment Booking System, CRM Lite, and AI Content Generator for a one-day assessment.
>
> Evaluate them based on development time, technical risk, CRUD functionality, UI potential, documentation value, deployment complexity, and Git commit opportunities.
>
> Recommend the strongest option for building a complete and polished MVP.

### AI Contribution

The AI recommended a Task Management App because it could demonstrate:

- CRUD operations
- Search and filters
- Data persistence
- Dashboard statistics
- Validation
- Responsive UI
- Real-world usefulness

### Decision

I selected:

**TaskFlow – Smart Task Management Application**

---

# Phase 2: Planning and Technical Decisions

## 6. Creating the Planning Document

### Goal

Create the required planning document before development.

### Prompt

> Create a planning document for TaskFlow, a React and Vite task management application.
>
> Include:
> - Problem statement
> - Target users
> - Application overview
> - Feature list
> - Technical architecture
> - Task data model
> - Planned components
> - Development milestones
> - Testing criteria
> - Known limitations
> - Future backend improvements
>
> Keep the scope realistic for a one-day deadline and use localStorage for the MVP.

### AI Contribution

The AI provided the initial structure for:

- `docs/planning.md`
- Task data model
- Feature milestones
- Testing goals
- Future improvements

### Manual Changes

I adjusted the feature scope and removed authentication and backend development from the MVP.

---

## 7. Choosing localStorage

### Goal

Decide whether to use localStorage, Firebase, or a complete backend.

### Prompt

> Compare localStorage, Firebase, and a Node.js, Express, and MongoDB backend for this assessment.
>
> Consider the one-day deadline, deployment risk, authentication requirements, data persistence, project stability, and future extensibility.
>
> Recommend the most responsible MVP choice instead of automatically choosing the most advanced option.

### AI Contribution

The AI explained that a backend would provide stronger long-term functionality but could introduce:

- Authentication issues
- Database connection errors
- API bugs
- Environment-variable problems
- Deployment delays

### Decision

I used localStorage for the MVP and documented Node.js, Express, MongoDB, REST APIs, and JWT authentication as future improvements.

---

# Phase 3: Project and Git Setup

## 8. Resolving the Git File Error

### Goal

Fix the planning-file staging error while preserving the required commit order.

### Error

```text
fatal: pathspec 'docs/planning.md' did not match any files