import { useState, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { useData, useItemsByType } from "../context/DataContext";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusDot from "../components/StatusDot";
import Tag from "../components/Tag";
import ViewToggle from "../components/ViewToggle";
import FilterBar from "../components/FilterBar";
import QuickCreate from "../components/QuickCreate";
import "../styles/career.css";

const CAREER_TYPES = [
  "Resume", "Portfolio", "Interview",
  "Job Application", "Certification", "Practice", "Other",
];

const SORT_FNS = {
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  oldest: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
  deadline: (a, b) => new Date(a.deadline?.split("/").reverse().join("-") || 0) - new Date(b.deadline?.split("/").reverse().join("-") || 0),
  alpha: (a, b) => a.title?.localeCompare(b.title),
};

function Career() {
  const { query: searchQuery } = useSearch();
  const goals = useItemsByType("goal", "career");
  const { addItem } = useData();
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState("cards");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState(null);

  const allTags = useMemo(() => {
    const set = new Set();
    goals.forEach((g) => g.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [goals]);

  const filtered = useMemo(() => {
    let result = [...goals];

    if (statusFilter === "active") {
      result = result.filter((g) => g.status !== "completed");
    } else if (statusFilter === "completed") {
      result = result.filter((g) => g.status === "completed");
    }

    if (activeTag) result = result.filter((g) => g.tags?.includes(activeTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((g) => g.title?.toLowerCase().includes(q));
    }

    const sorter = SORT_FNS[sortBy];
    if (sorter) result.sort(sorter);

    return result;
  }, [goals, statusFilter, activeTag, sortBy, searchQuery]);

  const handleCreate = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    addItem({
      type: "goal", category: "career",
      title: fd.get("title"),
      goalType: fd.get("type"),
      deadline: new Date(fd.get("deadline")).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      notes: fd.get("notes"),
      statusDot: "gray",
      status: "not_started",
      tags: [],
    });
    setShowCreate(false);
  };

  const handleQuickCreate = (title) => {
    addItem({
      type: "goal", category: "career",
      title,
      goalType: "Other",
      deadline: "—",
      notes: "",
      statusDot: "gray",
      status: "not_started",
      tags: [],
    });
  };

  const typeCounts = {};
  goals.forEach((g) => {
    const t = g.goalType || g.type;
    typeCounts[t] = (typeCounts[t] || 0) + 1;
  });
  const typeSummary = Object.entries(typeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([type, count]) => `${count} ${type}`)
    .join(", ");

  if (showCreate) {
    return (
      <div className="Career">
        <Card className="Career-create-card">
          <h2 className="Career-create-title">Create Career Goal</h2>
          <form onSubmit={handleCreate} className="Career-create-form">
            <div className="Career-field">
              <label>Title</label>
              <input type="text" name="title" placeholder="e.g. Update Resume" required />
            </div>
            <div className="Career-field">
              <label>Type</label>
              <div className="Career-types">
                {CAREER_TYPES.map((t) => (
                  <label key={t} className="Career-type-radio">
                    <input type="radio" name="type" value={t} defaultChecked={t === "Resume"} />
                    {t}
                  </label>
                ))}
              </div>
            </div>
            <div className="Career-field">
              <label>Deadline</label>
              <input type="date" name="deadline" required />
            </div>
            <div className="Career-field">
              <label>Notes <span className="Career-opt">(Optional)</span></label>
              <textarea name="notes" rows={4} placeholder="Any additional details..." />
            </div>
            <div className="Career-create-actions">
              <Button type="submit">Create Career Goal</Button>
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="Career">
      <div className="PageInsight">
        <p className="PageInsight-question">Where are you heading?</p>
        {goals.length > 0 && (
          <div className="PageInsight-stats">
            <span className="PageInsight-stat"><strong>{goals.length}</strong> goal{goals.length !== 1 ? "s" : ""}</span>
            <span className="PageInsight-sep">·</span>
            <span className="PageInsight-stat">{typeSummary}</span>
          </div>
        )}
      </div>

      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Career</h2>
        <div className="SectionHeader-actions">
          <ViewToggle active={view} onChange={setView} />
          <button className="SectionHeader-action" onClick={() => setShowCreate(true)}>+ New</button>
        </div>
      </div>

      {goals.length > 0 && (
        <FilterBar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
          tags={allTags}
          activeTag={activeTag}
          onTagChange={setActiveTag}
        />
      )}

      {filtered.length === 0 ? (
        <div className="Career-empty">
          <p className="Career-empty-text">{goals.length === 0 ? "Your future employer hasn't met you yet." : "No matches found."}</p>
          <Button size="sm" onClick={() => setShowCreate(true)}>+ Create Career Goal</Button>
        </div>
      ) : view === "list" ? (
        <div className="ProjectList-table">
          <div className="ProjectList-table-header">
            <span className="ProjectList-table-cell ProjectList-table-cell--wide">Title</span>
            <span className="ProjectList-table-cell">Type</span>
            <span className="ProjectList-table-cell">Deadline</span>
            <span className="ProjectList-table-cell">Status</span>
          </div>
          {filtered.map((goal) => (
            <div key={goal.id} className="ProjectList-table-row">
              <span className="ProjectList-table-cell ProjectList-table-cell--wide">
                {goal.title}
                {goal.tags?.length > 0 && (
                  <div className="ProjectList-table-tags">{goal.tags.map((t) => <Tag key={t} label={t} />)}</div>
                )}
              </span>
              <span className="ProjectList-table-cell">{goal.goalType || goal.type}</span>
              <span className="ProjectList-table-cell">{goal.deadline}</span>
              <span className="ProjectList-table-cell"><StatusDot color={goal.statusDot} /></span>
            </div>
          ))}
        </div>
      ) : view === "table" ? (
        <table className="ProjectList-table-view">
          <thead><tr><th>Title</th><th>Type</th><th>Deadline</th><th>Tags</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((goal) => (
              <tr key={goal.id}>
                <td>{goal.title}</td>
                <td>{goal.goalType || goal.type}</td>
                <td>{goal.deadline}</td>
                <td>{goal.tags?.length > 0 && goal.tags.map((t) => <Tag key={t} label={t} />)}</td>
                <td><StatusDot color={goal.statusDot} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="Career-grid">
          {filtered.map((goal) => (
            <Card key={goal.id} className="Career-card">
              <div className="Career-card-body">
                <StatusDot color={goal.statusDot} />
                <div className="Career-card-info">
                  <span className="Career-card-title">{goal.title}</span>
                  <div className="Career-card-meta">
                    <span className="Career-card-type">{goal.goalType || goal.type}</span>
                    <span className="Career-card-deadline">Deadline: {goal.deadline}</span>
                  </div>
                  {goal.tags?.length > 0 && (
                    <div style={{ display: "flex", gap: 4, marginTop: 4, flexWrap: "wrap" }}>
                      {goal.tags.map((t) => <Tag key={t} label={t} />)}
                    </div>
                  )}
                </div>
              </div>
              <span className="Career-card-chevron">▶</span>
            </Card>
          ))}
        </div>
      )}

      <QuickCreate onCreate={handleQuickCreate} placeholder="Career goal..." />
    </div>
  );
}

export default Career;
