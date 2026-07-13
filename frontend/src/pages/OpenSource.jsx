import { useState, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { useData } from "../context/DataContext";
import Card from "../components/Card";
import Button from "../components/Button";
import ViewToggle from "../components/ViewToggle";
import QuickCreate from "../components/QuickCreate";
import "../styles/opensource.css";

function OpenSource() {
  const { query: searchQuery } = useSearch();
  const { items, addItem, updateItem } = useData();

  const routines = useMemo(() => items.filter((i) => i.type === "routine" && i.category === "opensource"), [items]);
  const totalContributions = useMemo(
    () => items.filter((i) => i.type === "routine" && i.category === "opensource" && i.completed).length,
    [items]
  );

  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState("cards");

  const filtered = routines.filter((r) =>
    !searchQuery || r.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRoutineComplete = (id) => {
    const r = items.find((i) => i.id === id);
    if (r) updateItem(id, { completed: !r.completed });
  };

  const handleCreateRoutine = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addItem({
      type: "routine", category: "opensource",
      title: fd.get("title"),
      repeat: fd.get("repeat"),
      nextDue: fd.get("startDate")
        ? new Date(fd.get("startDate")).toLocaleDateString("en-GB", {
            day: "numeric", month: "short", year: "numeric",
          })
        : "—",
      completed: false,
    });
    setShowCreate(false);
  };

  const handleQuickCreate = (title) => {
    addItem({
      type: "routine", category: "opensource",
      title,
      repeat: "Monthly",
      nextDue: "—",
      completed: false,
    });
  };

  if (showCreate) {
    return (
      <div className="OpenSource">
        <div className="CreateOSR">
          <Card className="CreateOSR-card">
            <h2 className="CreateOSR-title">Create Open Source Routine</h2>
            <p className="CreateOSR-subtitle">Set a recurring goal to stay active in open source.</p>
            <form onSubmit={handleCreateRoutine} className="CreateOSR-form">
              <div className="CreateOSR-field">
                <label>What kind of contribution do you plan on making?</label>
                <input name="title" type="text" placeholder="e.g. Monthly Open Source Contribution" required />
              </div>
              <div className="CreateOSR-field">
                <label>How often?</label>
                <div className="CreateOSR-chips">
                  {["Daily", "Weekly", "Monthly", "Custom"].map((opt) => (
                    <label key={opt} className="CreateOSR-chip">
                      <input type="radio" name="repeat" value={opt} defaultChecked={opt === "Monthly"} />
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
                  <label>End Date <span className="CreateOSR-opt">(Optional)</span></label>
                  <input name="targetEndDate" type="date" />
                </div>
              </div>
              <div className="CreateOSR-actions">
                <Button type="submit">Create Routine</Button>
                <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="OpenSource">
      <div className="PageInsight">
        <p className="PageInsight-question">How are you giving back?</p>
        {routines.length > 0 && (
          <div className="PageInsight-stats">
            <span className="PageInsight-stat"><strong>{routines.filter((r) => r.completed).length}/{routines.length}</strong> routines done</span>
            <span className="PageInsight-sep">·</span>
            <span className="PageInsight-stat"><strong>{totalContributions}</strong> total contributions</span>
          </div>
        )}
      </div>

      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Open Source</h2>
        <div className="SectionHeader-actions">
          <ViewToggle active={view} onChange={setView} />
          <button className="SectionHeader-action" onClick={() => setShowCreate(true)}>+ New</button>
        </div>
      </div>

      <section className="OS-summary">
        <Card className="OS-summary-card">
          <span className="OS-summary-label">Total Contributions</span>
          <span className="OS-summary-value">{totalContributions}</span>
        </Card>
      </section>

      <section className="OS-routines">
        <h3>Routine Goals</h3>
        {filtered.length === 0 ? (
          <Card className="OS-empty">
            <p className="OS-empty-text">{routines.length === 0 ? "The community is waiting." : "No matches found."}</p>
            <Button size="sm" onClick={() => setShowCreate(true)}>+ Create Routine Goal</Button>
          </Card>
        ) : view === "list" || view === "table" ? (
          <div className="ProjectList-table">
            <div className="ProjectList-table-header">
              <span className="ProjectList-table-cell ProjectList-table-cell--wide">Title</span>
              <span className="ProjectList-table-cell">Repeat</span>
              <span className="ProjectList-table-cell">Next Due</span>
              <span className="ProjectList-table-cell">Done</span>
            </div>
            {filtered.map((routine) => (
              <label key={routine.id} className="ProjectList-table-row">
                <span className="ProjectList-table-cell ProjectList-table-cell--wide">{routine.title}</span>
                <span className="ProjectList-table-cell">{routine.repeat}</span>
                <span className="ProjectList-table-cell">{routine.nextDue}</span>
                <span className="ProjectList-table-cell">
                  <input type="checkbox" checked={routine.completed} onChange={() => handleRoutineComplete(routine.id)} style={{ accentColor: "var(--primary)" }} />
                </span>
              </label>
            ))}
          </div>
        ) : (
          <div className="OS-routine-list">
            {filtered.map((routine) => (
              <label key={routine.id} className={`OS-routine ${routine.completed ? "OS-routine--done" : ""}`}>
                <input type="checkbox" checked={routine.completed} onChange={() => handleRoutineComplete(routine.id)} className="OS-routine-checkbox" />
                <div className="OS-routine-body">
                  <span className="OS-routine-title">{routine.title}</span>
                  <span className="OS-routine-meta">{routine.repeat} · Next: {routine.nextDue}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </section>

      <QuickCreate onCreate={handleQuickCreate} placeholder="Contribution goal..." />
    </div>
  );
}

export default OpenSource;
