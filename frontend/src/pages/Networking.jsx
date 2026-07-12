/*
  ─── Networking Page ───

  API: GET /routines?category=networking&sort=next_due
  API: POST /routines
  API: PATCH /routines/:id/complete

  API: GET /events?sort=date&limit=10
  API: POST /events
*/

import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import CreateEvent from "../components/CreateEvent";
import "../styles/networking.css";

const PLATFORMS = ["LinkedIn", "Twitter", "GitHub", "Discord", "Slack", "Other"];

function Networking() {
  const [routines, setRoutines] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("list"); // "list" | "create-routine" | "create-event"

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
    /* API: POST /routines { category: "networking", ... } */
    const routine = {
      id: `net-routine-${Date.now()}`,
      title: fd.get("title"),
      category: "Networking",
      platform: fd.get("platform"),
      repeat: fd.get("repeat"),
      nextDue: fd.get("targetDate")
        ? new Date(fd.get("targetDate")).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })
        : "—",
      streak: 0,
      completed: false,
    };
    setRoutines((prev) => [...prev, routine]);
    setView("list");
  };

  const handleCreateEvent = (formData) => {
    /* API: POST /events */
    const event = {
      id: `net-event-${Date.now()}`,
      name: formData.name,
      date: new Date(formData.date).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      daysLeft: Math.ceil(
        (new Date(formData.date) - new Date()) / (1000 * 60 * 60 * 24)
      ),
      location: formData.location || undefined,
    };
    setEvents((prev) => [...prev, event]);
    setView("list");
  };

  /* ── Create Routine View ── */
  if (view === "create-routine") {
    return (
      <div className="Networking">
        <Card className="NetCreate-card">
          <h2 className="NetCreate-title">Create Routine</h2>
          <form onSubmit={handleCreateRoutine} className="NetCreate-form">
            <div className="NetCreate-field">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Post on LinkedIn"
                required
              />
            </div>

            <div className="NetCreate-field">
              <label>Category</label>
              <select name="category" defaultValue="Networking">
                <option>Networking</option>
                <option>Open Source</option>
                <option>Personal</option>
                <option>Learning</option>
              </select>
            </div>

            <div className="NetCreate-field">
              <label>Platform <span className="NetCreate-opt">(Optional)</span></label>
              <select name="platform" defaultValue="LinkedIn">
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="NetCreate-field">
              <label>Repeat</label>
              <select name="repeat" defaultValue="Weekly">
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
                <option>Custom</option>
              </select>
            </div>

            <div className="NetCreate-field">
              <label>Target Date <span className="NetCreate-opt">(Optional)</span></label>
              <input type="date" name="targetDate" />
            </div>

            <div className="NetCreate-actions">
              <Button type="submit">Create</Button>
              <Button type="button" variant="ghost" onClick={() => setView("list")}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  /* ── Create Event View ── */
  if (view === "create-event") {
    return (
      <div className="Networking">
        <CreateEvent
          onSubmit={handleCreateEvent}
          onCancel={() => setView("list")}
        />
      </div>
    );
  }

  /* ── List View ── */
  return (
    <div className="Networking">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Networking</h2>
        <Button size="sm" onClick={() => setView("create-routine")}>+ Create</Button>
      </div>

      {/* ─── Routine Goals ─── */}
      <section className="Networking-section">
        <div className="SectionHeader">
          <h3 className="SectionHeader-title">Routine Goals</h3>
          <button
            className="SectionHeader-action"
            onClick={() => setView("create-routine")}
          >
            + New
          </button>
        </div>

        {routines.length === 0 ? (
          <Card className="Networking-empty">
            <p className="Networking-empty-text">
              No networking routines yet.
            </p>
            <Button size="sm" onClick={() => setView("create-routine")}>
              + Create Routine
            </Button>
          </Card>
        ) : (
          <div className="Networking-routine-list">
            {routines.map((routine) => (
              <label
                key={routine.id}
                className={`Networking-routine ${routine.completed ? "Networking-routine--done" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={routine.completed}
                  onChange={() => handleRoutineComplete(routine.id)}
                  className="Networking-routine-checkbox"
                />
                <div className="Networking-routine-body">
                  <span className="Networking-routine-title">
                    {routine.title}
                  </span>
                  <span className="Networking-routine-meta">
                    {routine.repeat}{routine.platform ? ` · ${routine.platform}` : ""}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      {/* ─── Upcoming Events ─── */}
      <section className="Networking-section">
        <div className="SectionHeader">
          <h3 className="SectionHeader-title">Upcoming Events</h3>
          <button
            className="SectionHeader-action"
            onClick={() => setView("create-event")}
          >
            + Add
          </button>
        </div>

        {events.length === 0 ? (
          <Card className="Networking-empty">
            <p className="Networking-empty-text">
              No upcoming events.
            </p>
            <Button size="sm" onClick={() => setView("create-event")}>
              + Add Event
            </Button>
          </Card>
        ) : (
          <div className="Networking-event-list">
            {events.map((event) => (
              <Card key={event.id} className="Networking-event">
                <div className="Networking-event-info">
                  <span className="Networking-event-name">{event.name}</span>
                  <span className="Networking-event-date">
                    {event.date}{event.location ? ` · ${event.location}` : ""}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Networking;
