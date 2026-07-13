import { useState, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { useData, useItemsByType } from "../context/DataContext";
import LearningCard from "../components/LearningCard";
import LearningDetail from "../components/LearningDetail";
import CreateLearningGoal from "../components/CreateLearningGoal";
import ViewToggle from "../components/ViewToggle";
import FilterBar from "../components/FilterBar";
import QuickCreate from "../components/QuickCreate";
import Tag from "../components/Tag";
import ProgressBar from "../components/ProgressBar";
import Button from "../components/Button";
import "../styles/learning.css";

const SORT_FNS = {
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  oldest: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
  deadline: (a, b) => new Date(a.targetDate?.split("/").reverse().join("-") || 0) - new Date(b.targetDate?.split("/").reverse().join("-") || 0),
  alpha: (a, b) => a.title?.localeCompare(b.title),
  priority: (a, b) => (b.progress?.completed || 0) / Math.max(b.progress?.total || 1, 1) - (a.progress?.completed || 0) / Math.max(a.progress?.total || 1, 1),
};

function SelfLearning() {
  const { query: searchQuery } = useSearch();
  const goals = useItemsByType("goal", "learning");
  const { addItem } = useData();
  const [selectedId, setSelectedId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState("cards");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState(null);

  const selectedGoal = goals.find((g) => g.id === selectedId) ?? null;

  const allTags = useMemo(() => {
    const set = new Set();
    goals.forEach((g) => g.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [goals]);

  const filtered = useMemo(() => {
    let result = [...goals];

    if (statusFilter === "active") {
      result = result.filter((g) => g.progress?.total === 0 || g.progress?.completed < g.progress?.total);
    } else if (statusFilter === "completed") {
      result = result.filter((g) => g.progress?.total > 0 && g.progress?.completed >= g.progress?.total);
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

  const handleCreate = (formData) => {
    addItem({
      type: "goal", category: "learning",
      title: formData.title,
      progress: { completed: formData.completed, total: Number(formData.total) },
      progressUnit: formData.progressType,
      source: { type: formData.sourceType, name: formData.sourceName || undefined },
      statusDot: "gray",
      targetDate: new Date(formData.targetDate).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      estimatedCompletion: "—",
      todayGoal: null,
      schedule: formData.studyFrequency,
      notes: [],
      tags: formData.tags || [],
    });
    setShowCreate(false);
  };

  const handleQuickCreate = (title) => {
    addItem({
      type: "goal", category: "learning",
      title,
      progress: { completed: 0, total: 1 },
      progressUnit: "Lessons",
      source: { type: "Course" },
      statusDot: "gray",
      targetDate: "—",
      estimatedCompletion: "—",
      todayGoal: null,
      schedule: "Weekly",
      notes: [],
      tags: [],
    });
  };

  const handleSelect = (id) => setSelectedId(id);
  const handleBack = () => setSelectedId(null);

  const completedLessons = goals.reduce((sum, g) => sum + (g.progress?.completed || 0), 0);
  const totalLessons = goals.reduce((sum, g) => sum + (g.progress?.total || 0), 0);

  if (selectedGoal) {
    return <LearningDetail goal={selectedGoal} onBack={handleBack} />;
  }

  if (showCreate) {
    return (
      <CreateLearningGoal
        onSubmit={handleCreate}
        onCancel={() => setShowCreate(false)}
      />
    );
  }

  return (
    <div className="LearningList">
      <div className="PageInsight">
        <p className="PageInsight-question">What are you learning?</p>
        {goals.length > 0 && (
          <div className="PageInsight-stats">
            <span className="PageInsight-stat"><strong>{goals.length}</strong> subjects</span>
            <span className="PageInsight-sep">·</span>
            <span className="PageInsight-stat"><strong>{completedLessons}/{totalLessons}</strong> lessons</span>
            <span className="PageInsight-sep">·</span>
            <span className="PageInsight-stat"><strong>{totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0}%</strong> complete</span>
          </div>
        )}
      </div>

      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Self Learning</h2>
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
        <div className="LearningList-empty">
          <p className="LearningList-empty-text">{goals.length === 0 ? "Ready to learn something new?" : "No matches found."}</p>
          <Button size="sm" onClick={() => setShowCreate(true)}>+ Create Learning Goal</Button>
        </div>
      ) : view === "list" ? (
        <div className="ProjectList-table">
          <div className="ProjectList-table-header">
            <span className="ProjectList-table-cell ProjectList-table-cell--wide">Title</span>
            <span className="ProjectList-table-cell">Source</span>
            <span className="ProjectList-table-cell">Progress</span>
            <span className="ProjectList-table-cell">Target</span>
          </div>
          {filtered.map((goal) => (
            <div key={goal.id} className="ProjectList-table-row" onClick={() => handleSelect(goal.id)}>
              <span className="ProjectList-table-cell ProjectList-table-cell--wide">
                {goal.title}
                {goal.tags?.length > 0 && (
                  <div className="ProjectList-table-tags">{goal.tags.map((t) => <Tag key={t} label={t} />)}</div>
                )}
              </span>
              <span className="ProjectList-table-cell">{goal.source?.name || goal.source?.type}</span>
              <span className="ProjectList-table-cell"><ProgressBar completed={goal.progress?.completed || 0} total={goal.progress?.total || 0} /></span>
              <span className="ProjectList-table-cell">{goal.targetDate}</span>
            </div>
          ))}
        </div>
      ) : view === "table" ? (
        <table className="ProjectList-table-view">
          <thead><tr><th>Title</th><th>Source</th><th>Progress</th><th>Target</th><th>Tags</th></tr></thead>
          <tbody>
            {filtered.map((goal) => (
              <tr key={goal.id} onClick={() => handleSelect(goal.id)}>
                <td>{goal.title}</td>
                <td>{goal.source?.name || goal.source?.type}</td>
                <td><ProgressBar completed={goal.progress?.completed || 0} total={goal.progress?.total || 0} /></td>
                <td>{goal.targetDate}</td>
                <td>{goal.tags?.length > 0 && goal.tags.map((t) => <Tag key={t} label={t} />)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="LearningList-grid">
          {filtered.map((goal) => (
            <LearningCard key={goal.id} goal={goal} onSelect={handleSelect} />
          ))}
        </div>
      )}

      <QuickCreate onCreate={handleQuickCreate} placeholder="What do you want to learn?" />
    </div>
  );
}

export default SelfLearning;
