import { useState, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import Button from "../components/Button";
import ViewToggle from "../components/ViewToggle";
import QuickCreate from "../components/QuickCreate";
import CreateEvent from "../components/CreateEvent";
import "../styles/networking.css";

const PLATFORMS = ["LinkedIn", "Twitter", "GitHub", "Discord", "Slack", "Other"];

function Networking() {
  const { query: searchQuery } = useSearch();
  const { items, addItem, updateItem } = useData();

  const routines = useMemo(() => items.filter((i) => i.type === "routine" && i.category === "networking"), [items]);
  const events = useMemo(() => items.filter((i) => i.type === "event"), [items]);

  const [createView, setCreateView] = useState("list");
  const [routineView, setRoutineView] = useState("cards");

  const filteredRoutines = routines.filter((r) =>
    !searchQuery || r.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = events.filter((e) =>
    !searchQuery || e.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoutineComplete = (id) => {
    const r = items.find((i) => i.id === id);
    if (r) updateItem(id, { completed: !r.completed });
  };

  const handleCreateRoutine = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addItem({
      type: "routine", category: "networking",
      title: fd.get("title"),
      platform: fd.get("platform"),
      repeat: fd.get("repeat"),
      nextDue: fd.get("targetDate")
        ? new Date(fd.get("targetDate")).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })
        : "—",
      completed: false,
      tags: [],
    });
    setCreateView("list");
  };

  const handleCreateEvent = (formData) => {
    addItem({
      type: "event",
      name: formData.name,
      date: new Date(formData.date).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      daysLeft: Math.ceil(
        (new Date(formData.date) - new Date()) / (1000 * 60 * 60 * 24)
      ),
      location: formData.location || undefined,
    });
    setCreateView("list");
  };

  const handleQuickRoutine = (title) => {
    addItem({
      type: "routine", category: "networking",
      title,
      platform: "LinkedIn",
      repeat: "Weekly",
      nextDue: "—",
      completed: false,
      tags: [],
    });
  };

  if (createView === "create-routine") {
    return (
      <div className="Networking">
        <Card className="NetCreate-card">
          <h2 className="NetCreate-title">Create Routine</h2>
          <form onSubmit={handleCreateRoutine} className="NetCreate-form">
            <div className="NetCreate-field">
              <label>Title</label>
              <input type="text" name="title" placeholder="e.g. Post on LinkedIn" required />
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
              <Button type="button" variant="ghost" onClick={() => setCreateView("list")}>Cancel</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  if (createView === "create-event") {
    return (
      <div className="Networking">
        <CreateEvent onSubmit={handleCreateEvent} onCancel={() => setCreateView("list")} />
      </div>
    );
  }

  return (
    <div className="Networking">
      <div className="PageInsight">
        <p className="PageInsight-question">Who are you meeting?</p>
        {(routines.length > 0 || events.length > 0) && (
          <div className="PageInsight-stats">
            {routines.length > 0 && (
              <>
                <span className="PageInsight-stat"><strong>{routines.filter((r) => r.completed).length}/{routines.length}</strong> routines</span>
                <span className="PageInsight-sep">·</span>
              </>
            )}
            {events.length > 0 && (
              <span className="PageInsight-stat"><strong>{events.length}</strong> upcoming event{events.length !== 1 ? "s" : ""}</span>
            )}
          </div>
        )}
      </div>

      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Networking</h2>
        <div className="SectionHeader-actions">
          <ViewToggle active={routineView} onChange={setRoutineView} />
          <button className="SectionHeader-action" onClick={() => setCreateView("create-routine")}>+ New</button>
        </div>
      </div>

      <section className="Networking-section">
        <div className="SectionHeader">
          <h3 className="SectionHeader-title">Routine Goals</h3>
          <button className="SectionHeader-action" onClick={() => setCreateView("create-routine")}>+ New</button>
        </div>

        {filteredRoutines.length === 0 ? (
          <Card className="Networking-empty">
            <p className="Networking-empty-text">Connections don&apos;t build themselves.</p>
            <Button size="sm" onClick={() => setCreateView("create-routine")}>+ Create Routine</Button>
          </Card>
        ) : routineView === "list" || routineView === "table" ? (
          <div className="ProjectList-table">
            <div className="ProjectList-table-header">
              <span className="ProjectList-table-cell ProjectList-table-cell--wide">Title</span>
              <span className="ProjectList-table-cell">Platform</span>
              <span className="ProjectList-table-cell">Repeat</span>
              <span className="ProjectList-table-cell">Done</span>
            </div>
            {filteredRoutines.map((routine) => (
              <label key={routine.id} className="ProjectList-table-row">
                <span className="ProjectList-table-cell ProjectList-table-cell--wide">{routine.title}</span>
                <span className="ProjectList-table-cell">{routine.platform || "—"}</span>
                <span className="ProjectList-table-cell">{routine.repeat}</span>
                <span className="ProjectList-table-cell">
                  <input type="checkbox" checked={routine.completed} onChange={() => handleRoutineComplete(routine.id)} style={{ accentColor: "var(--primary)" }} />
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="Networking-routine-list">
            {filteredRoutines.map((routine) => (
              <label key={routine.id} className={`Networking-routine ${routine.completed ? "Networking-routine--done" : ""}`}>
                <input type="checkbox" checked={routine.completed} onChange={() => handleRoutineComplete(routine.id)} className="Networking-routine-checkbox" />
                <div className="Networking-routine-body">
                  <span className="Networking-routine-title">{routine.title}</span>
                  <span className="Networking-routine-meta">{routine.repeat}{routine.platform ? ` · ${routine.platform}` : ""}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="Networking-section">
        <div className="SectionHeader">
          <h3 className="SectionHeader-title">Upcoming Events</h3>
          <button className="SectionHeader-action" onClick={() => setCreateView("create-event")}>+ Add</button>
        </div>

        {filteredEvents.length === 0 ? (
          <Card className="Networking-empty">
            <p className="Networking-empty-text">Nothing on the calendar yet.</p>
            <Button size="sm" onClick={() => setCreateView("create-event")}>+ Add Event</Button>
          </Card>
        ) : (
          <div className="Networking-event-list">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="Networking-event">
                <div className="Networking-event-info">
                  <span className="Networking-event-name">{event.name}</span>
                  <span className="Networking-event-date">{event.date}{event.location ? ` · ${event.location}` : ""}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      <QuickCreate onCreate={handleQuickRoutine} placeholder="Routine name..." />
    </div>
  );
}

export default Networking;
