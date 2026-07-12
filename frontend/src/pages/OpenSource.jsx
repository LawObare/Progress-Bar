/*
  ─── Open Source Page ───

  Sections:
    1. Monthly Goal — Contribution counter with motivational quote
    2. Lifetime Stats — repos, total contributions, streak
    3. Routine Goals — recurring contribution goals (custom display)

  API:
    GET /opensource/stats
    Response: { monthlyGoal: { completed, total }, lifetime: { repos, contributions, streak } }

    GET /routines?category=opensource&sort=next_due
    POST /routines
    PATCH /routines/:id/complete
*/

import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import "../styles/opensource.css";

function OpenSource() {
  const [routines, setRoutines] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  /*
    API: GET /opensource/stats
    Placeholder data shape until backend is wired.
  */
  const stats = {
    monthlyGoal: { completed: 0, total: 1 },
    lifetime: { repos: 0, contributions: 0, streak: 0 },
  };

  const handleRoutineComplete = (id) => {
    /* API: PATCH /routines/:id/complete */
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const handleCreateRoutine = (formData) => {
    /* API: POST /routines */
    const routine = {
      id: `routine-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      repeat: formData.repeat,
      nextDue: new Date(formData.startDate).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      streak: 0,
      completed: false,
    };
    setRoutines((prev) => [...prev, routine]);
    setShowCreate(false);
  };

  if (showCreate) {
    return (
      <div className="OpenSource">
        <div className="CreateOSR">
          <Card className="CreateOSR-card">
            <h2 className="CreateOSR-title">Create Open Source Routine</h2>
            <p className="CreateOSR-subtitle">
              Set a recurring goal to stay active in open source.
            </p>

            <form
              className="CreateOSR-form"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                handleCreateRoutine({
                  title: fd.get("title"),
                  repeat: fd.get("repeat"),
                  category: "Open Source",
                  startDate: fd.get("startDate"),
                  targetEndDate: fd.get("targetEndDate"),
                });
              }}
            >
              <div className="CreateOSR-field">
                <label htmlFor="osr-title">What kind of contribution do you plan on making?</label>
                <input
                  id="osr-title"
                  name="title"
                  type="text"
                  placeholder="e.g. Monthly Open Source Contribution"
                  required
                />
              </div>

              <div className="CreateOSR-field">
                <label>How often?</label>
                <div className="CreateOSR-chips">
                  {["Daily", "Weekly", "Monthly", "Custom"].map((opt) => (
                    <label key={opt} className="CreateOSR-chip">
                      <input
                        type="radio"
                        name="repeat"
                        value={opt}
                        defaultChecked={opt === "Monthly"}
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="CreateOSR-row">
                <div className="CreateOSR-field">
                  <label htmlFor="osr-start">Start Date</label>
                  <input id="osr-start" name="startDate" type="date" required />
                </div>
                <div className="CreateOSR-field">
                  <label htmlFor="osr-end">
                    End Date <span className="CreateOSR-opt">(Optional)</span>
                  </label>
                  <input id="osr-end" name="targetEndDate" type="date" />
                </div>
              </div>

              <div className="CreateOSR-actions">
                <Button type="submit">Create Routine</Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="OpenSource">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Open Source</h2>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          + Create
        </Button>
      </div>

      {/* ─── Monthly Goal ─── */}
      <section className="OpenSource-monthly">
        <h3>Monthly Goal</h3>
        <Card className="OpenSource-monthly-card">
          <div className="OpenSource-monthly-ring">
            <svg viewBox="0 0 120 120" className="OpenSource-ring-svg">
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="var(--border)"
                strokeWidth="8"
              />
              <circle
                cx="60" cy="60" r="52"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="8"
                strokeDasharray={`${(stats.monthlyGoal.completed / Math.max(stats.monthlyGoal.total, 1)) * 327} 327`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
            </svg>
            <span className="OpenSource-monthly-count">
              {stats.monthlyGoal.completed}
              <span className="OpenSource-monthly-total">/{stats.monthlyGoal.total}</span>
            </span>
          </div>
          <p className="OpenSource-monthly-quote">
            &ldquo;One contribution every month keeps the merge conflicts away.&rdquo;
          </p>
        </Card>
      </section>

      {/* ─── Lifetime Stats ─── */}
      <section className="OpenSource-stats">
        <h3>Lifetime Stats</h3>
        <div className="OpenSource-stats-grid">
          <div className="OpenSource-stat">
            <p className="OpenSource-stat-value">{stats.lifetime.repos}</p>
            <p className="OpenSource-stat-label">Repositories Contributed To</p>
          </div>
          <div className="OpenSource-stat">
            <p className="OpenSource-stat-value">{stats.lifetime.contributions}</p>
            <p className="OpenSource-stat-label">Total Contributions</p>
          </div>
          <div className="OpenSource-stat">
            <p className="OpenSource-stat-value">{stats.lifetime.streak} months</p>
            <p className="OpenSource-stat-label">Current Streak</p>
          </div>
        </div>
      </section>

      {/* ─── Routine Goals (custom open-source display) ─── */}
      <section className="OpenSource-routines">
        <div className="SectionHeader">
          <h3 className="SectionHeader-title">Routine Goals</h3>
          <button className="SectionHeader-action" onClick={() => setShowCreate(true)}>
            + New
          </button>
        </div>

        {routines.length === 0 ? (
          <Card className="OpenSource-empty">
            <p className="OpenSource-empty-text">
              No routine goals yet. Create one to stay consistent.
            </p>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              + Create Routine Goal
            </Button>
          </Card>
        ) : (
          <div className="OpenSource-routine-list">
            {routines.map((routine) => (
              <label
                key={routine.id}
                className={`OpenSource-routine ${routine.completed ? "OpenSource-routine--done" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={routine.completed}
                  onChange={() => handleRoutineComplete(routine.id)}
                  className="OpenSource-routine-checkbox"
                />
                <div className="OpenSource-routine-body">
                  <span className="OpenSource-routine-title">
                    {routine.title}
                  </span>
                  <span className="OpenSource-routine-meta">
                    {routine.repeat} · Next: {routine.nextDue}
                  </span>
                </div>
                <span className="OpenSource-routine-streak">
                  🔥 {routine.streak}
                </span>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OpenSource;
