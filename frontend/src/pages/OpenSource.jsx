/*
  ─── Open Source Page ───

  Uses the Routine system.
  Contains: Routine Goals + Total Contributions.

  API:
    GET /routines?category=opensource&sort=next_due
    POST /routines
    PATCH /routines/:id/complete
    GET /opensource/stats → { totalContributions: number }
*/

import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import "../styles/opensource.css";

function OpenSource() {
  const [routines, setRoutines] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const totalContributions = 0;

  const handleRoutineComplete = (id) => {
    /* API: PATCH /routines/:id/complete */
    setRoutines((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const handleCreateRoutine = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    /* API: POST /routines { category: "Open Source", ... } */
    const routine = {
      id: `osr-${Date.now()}`,
      title: fd.get("title"),
      category: "Open Source",
      repeat: fd.get("repeat"),
      nextDue: fd.get("startDate")
        ? new Date(fd.get("startDate")).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })
        : "—",
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

            <form onSubmit={handleCreateRoutine} className="CreateOSR-form">
              <div className="CreateOSR-field">
                <label>What kind of contribution do you plan on making?</label>
                <input
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
                  <label>Start Date</label>
                  <input name="startDate" type="date" required />
                </div>
                <div className="CreateOSR-field">
                  <label>
                    End Date <span className="CreateOSR-opt">(Optional)</span>
                  </label>
                  <input name="targetEndDate" type="date" />
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
        <Button size="sm" onClick={() => setShowCreate(true)}>+ Create</Button>
      </div>

      {/* ─── Total Contributions ─── */}
      <section className="OS-summary">
        <Card className="OS-summary-card">
          <span className="OS-summary-label">Total Contributions</span>
          <span className="OS-summary-value">{totalContributions}</span>
        </Card>
      </section>

      {/* ─── Routine Goals ─── */}
      <section className="OS-routines">
        <h3>Routine Goals</h3>
        {routines.length === 0 ? (
          <Card className="OS-empty">
            <p className="OS-empty-text">The community is waiting.</p>
            <Button size="sm" onClick={() => setShowCreate(true)}>
              + Create Routine Goal
            </Button>
          </Card>
        ) : (
          <div className="OS-routine-list">
            {routines.map((routine) => (
              <label
                key={routine.id}
                className={`OS-routine ${routine.completed ? "OS-routine--done" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={routine.completed}
                  onChange={() => handleRoutineComplete(routine.id)}
                  className="OS-routine-checkbox"
                />
                <div className="OS-routine-body">
                  <span className="OS-routine-title">{routine.title}</span>
                  <span className="OS-routine-meta">
                    {routine.repeat} · Next: {routine.nextDue}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default OpenSource;
