/*
  API REFERENCE — Backend contract
  ================================

  These are the data shapes the frontend expects from the API.

  Base URL: /api/v1
  Auth: JWT in Authorization header (Bearer <token>)

  ─── Endpoints ───

  Goals (aggregated feed for Home)
    GET    /goals?status=active&sort=priority,deadline&limit=10
    POST   /goals
    GET    /goals/:id
    PUT    /goals/:id
    DELETE /goals/:id

  Projects
    GET    /projects?type=personal|client
    POST   /projects
    GET    /projects/:id            — includes milestones & tasks
    PUT    /projects/:id
    DELETE /projects/:id

  Milestones
    POST   /projects/:id/milestones
    PUT    /milestones/:id
    DELETE /milestones/:id

  Tasks (within milestones)
    POST   /milestones/:id/tasks
    PUT    /tasks/:id
    DELETE /tasks/:id

  Learning Goals
    GET    /learning
    POST   /learning
    GET    /learning/:id
    PUT    /learning/:id
    DELETE /learning/:id

  Career Goals
    GET    /career
    POST   /career
    GET    /career/:id
    PUT    /career/:id
    DELETE /career/:id

  Learning Goals
    GET    /learning                  → LearningGoal[] (list)
    POST   /learning                  → LearningGoal (created)
    GET    /learning/:id              → LearningGoal (full detail with notes)
    PUT    /learning/:id              → LearningGoal (updated)
    DELETE /learning/:id
    PATCH  /learning/:id/today-goal   → { completed: boolean }
    POST   /learning/:id/notes        → Note
    DELETE /notes/:id

  Routine Goals
    GET    /routines
    POST   /routines
    PUT    /routines/:id
    DELETE /routines/:id
    PATCH  /routines/:id/complete  — marks done, calculates next_due

  Events
    GET    /events
    POST   /events
    PUT    /events/:id
    DELETE /events/:id

  Open Source Stats
    GET    /opensource/stats

  My Why
    GET    /my-why
    PUT    /my-why

  Profile
    GET    /profile
    PUT    /profile

  Settings
    GET    /settings
    PUT    /settings
*/
