# API Endpoints

**Base URL:** `/api/v1`
**Auth:** JWT via `Authorization: Bearer <token>`

## Core Object Model

The application has exactly **four core object types**. Everything else is a category, relationship, or view.

| Type | Category | Page |
|------|----------|------|
| `project` | `personal` | Personal Projects |
| `project` | `client` | Client Projects |
| `goal` | `learning` | Self Learning |
| `goal` | `career` | Career |
| `routine` | `networking` | Networking |
| `routine` | `opensource` | Open Source |
| `event` | — | Networking |

> **Common Query Params** (available on list endpoints):
> | Param | Type | Description |
> |-------|------|-------------|
> | `search` | string | Full-text search across titles and descriptions |
> | `tag` | string | Filter by tag (exact match) |
> | `status` | string | Filter by status (`active`, `completed`, `all`) |
> | `sort` | string | Sort field (`newest`, `oldest`, `deadline`, `priority`, `alpha`) |
> | `view` | string | Preferred view (`cards`, `list`, `table`) |

---

## Authentication

### `POST /auth/login`

Authenticate a user.

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "rememberMe": "boolean"
}
```

**Response:** `200`
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string"
  }
}
```

---

### `POST /auth/register`

Create a new account.

**Request:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "confirmPassword": "string"
}
```

**Response:** `201`
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "fullName": "string",
    "email": "string"
  }
}
```

---

## Search

### `GET /search`

Global search across all resource types.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query (required) |

**Response:** `200`
```json
{
  "projects": [ ... ],
  "learning": [ ... ],
  "career": [ ... ],
  "routines": [ ... ],
  "events": [ ... ]
}
```

---

## Dashboard / Home

### `GET /goals`

Aggregated goal feed for the home dashboard.

**Query Params:**
| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter by status (`active`, `overdue`, `urgent`) |
| `sort` | string | Sort field(s), comma-separated (e.g. `priority,deadline`) |
| `limit` | number | Max results (default `10`) |

**Response:** `200`
```json
[
  {
    "id": "string",
    "title": "string",
    "category": "string",
    "categoryLabel": "string",
    "priority": "urgent | high | medium | low",
    "deadline": "string",
    "status": "string",
    "progress": {
      "completed": "number",
      "total": "number"
    }
  }
]
```

### `PATCH /goals/:id`

Update a goal's progress or status.

---

## Projects

### `GET /projects`

List projects. Supports `?type=personal|client` filter.

**Response:** `200`
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "progress": { "completed": "number", "total": "number" },
    "deadline": "string",
    "statusIndicator": "green | yellow | gray",
    "priority": "medium | high",
    "tags": ["string"],
    "createdAt": "string (ISO)",
    "milestones": [
      {
        "id": "string",
        "name": "string",
        "deadline": "string",
        "progress": { "completed": "number", "total": "number" },
        "tasks": [
          { "id": "string", "name": "string", "completed": "boolean" }
        ]
      }
    ]
  }
]
```

### `POST /projects`

Create a new project.

**Response:** `201` — Returns created project.

### `GET /projects/:id`

Get a single project with full milestone and task detail.

### `PUT /projects/:id`

Update a project.

### `DELETE /projects/:id`

---

## Milestones

### `POST /projects/:id/milestones`

Add a milestone to a project.

**Response:** `201` — Returns created milestone.

### `PUT /milestones/:id`

Update a milestone.

### `DELETE /milestones/:id`

---

## Tasks (within milestones)

### `POST /milestones/:id/tasks`

Add a task to a milestone.

### `PUT /tasks/:id`

Update a task (e.g. toggle completion).

### `DELETE /tasks/:id`

---

## Learning

### `GET /learning`

List learning goals.

**Response:** `200`
```json
[
  {
    "id": "string",
    "title": "string",
    "progress": { "completed": "number", "total": "number" },
    "progressUnit": "Lessons | Chapters | Modules | Videos | Exercises | Sections",
    "source": {
      "type": "Book | Course | Documentation | Tutorial | Video | Practice",
      "name": "string | null"
    },
    "statusDot": "green | yellow | gray",
    "targetDate": "string",
    "estimatedCompletion": "string",
    "todayGoal": { "label": "string", "completed": "boolean" } | null,
    "schedule": "string",
    "tags": ["string"],
    "createdAt": "string (ISO)",
    "notes": [
      { "id": "string", "content": "string", "createdAt": "string" }
    ]
  }
]
```

### `POST /learning`

Create a learning goal.

**Request:**
```json
{
  "title": "string",
  "sourceType": "string",
  "sourceName": "string | null",
  "progressType": "string",
  "completed": "number",
  "total": "number",
  "studyFrequency": "string",
  "targetDate": "string"
}
```

**Response:** `201` — Returns created goal.

### `GET /learning/:id`

Get full learning goal detail including notes.

### `PUT /learning/:id`

### `DELETE /learning/:id`

### `PATCH /learning/:id/today-goal`

Toggle today's goal completion.

**Request:**
```json
{
  "completed": "boolean"
}
```

### `POST /learning/:id/notes`

Add a note to a learning goal.

**Request:**
```json
{
  "content": "string"
}
```

---

## Notes

### `DELETE /notes/:id`

---

## Career

### `GET /career`

List career goals.

**Response:** `200`
```json
[
  {
    "id": "string",
    "title": "string",
    "type": "Resume | Portfolio | Interview | Job Application | Certification | Practice | Other",
    "deadline": "string",
    "notes": "string | null",
    "statusDot": "green | yellow | gray",
    "status": "not_started | in_progress | completed",
    "tags": ["string"],
    "createdAt": "string (ISO)"
  }
]
```

### `POST /career`

Create a career goal.

**Request:**
```json
{
  "title": "string",
  "type": "string",
  "deadline": "string",
  "notes": "string | null"
}
```

### `GET /career/:id`

### `PUT /career/:id`

### `DELETE /career/:id`

---

## Routines

Routines are used by Networking, Open Source, and other recurring goal contexts.

### `GET /routines`

List routine goals. Supports `?category=` and `?sort=` filters.

**Response:** `200`
```json
[
  {
    "id": "string",
    "title": "string",
    "category": "string",
    "platform": "string | null",
    "repeat": "Daily | Weekly | Monthly | Custom",
    "nextDue": "string",
    "completed": "boolean",
    "streak": "number | null"
  }
]
```

### `POST /routines`

Create a routine goal.

**Request:**
```json
{
  "title": "string",
  "category": "string",
  "platform": "string | null",
  "repeat": "string",
  "startDate": "string",
  "targetEndDate": "string | null"
}
```

### `PUT /routines/:id`

### `DELETE /routines/:id`

### `PATCH /routines/:id/complete`

Toggle completion. Server calculates next due date and streak.

**Request:**
```json
{
  "completed": "boolean"
}
```

---

## Events

### `GET /events`

List events. Supports `?sort=date` and `?limit=`.

**Response:** `200`
```json
[
  {
    "id": "string",
    "name": "string",
    "date": "string",
    "daysLeft": "number",
    "location": "string | null",
    "notes": "string | null"
  }
]
```

### `POST /events`

Create an event.

**Request:**
```json
{
  "name": "string",
  "date": "string",
  "location": "string | null",
  "notes": "string | null"
}
```

### `PUT /events/:id`

### `DELETE /events/:id`

---

## Open Source Stats

### `GET /opensource/stats`

Get aggregated open source contribution stats.

**Response:** `200`
```json
{
  "totalContributions": "number"
}
```

---

## My Why

### `GET /my-why`

Get the user's "why" content.

**Response:** `200`
```json
{
  "vision": "string",
  "purpose": "string",
  "letterToFutureSelf": "string",
  "quitMessage": "string",
  "mantra": "string"
}
```

### `PUT /my-why`

Update "my why" content.

**Request:** Same shape as response above.

---

## Profile

### `GET /profile`

Get user profile.

**Response:** `200`
```json
{
  "name": "string",
  "bio": "string",
  "avatar": "string | null",
  "journey": {
    "projectsCompleted": "number",
    "learningGoalsFinished": "number",
    "careerGoalsAchieved": "number",
    "openSourceContributions": "number",
    "routineGoalsCompleted": "number",
    "eventsAttended": "number"
  }
}
```

### `PUT /profile`

Update profile.

---

## Settings

### `GET /settings`

Get user settings.

**Response:** `200`
```json
{
  "theme": "light | dark | system",
  "dashboardToggles": {
    "showTodayTasks": "boolean",
    "showNeedsAttention": "boolean",
    "showRoutineGoals": "boolean",
    "showUpcomingEvents": "boolean"
  },
  "devMode": {
    "jokesEnabled": "boolean"
  },
  "weekStartsOn": "monday | sunday"
}
```

### `PUT /settings`

Update settings.

**Request:** Same shape as response above.
