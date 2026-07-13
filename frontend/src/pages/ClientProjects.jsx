import { useState, useMemo } from "react";
import { useSearch } from "../context/SearchContext";
import { useData, useItemsByType } from "../context/DataContext";
import ProjectList from "../components/ProjectList";
import CreateProject from "../components/CreateProject";
import ViewToggle from "../components/ViewToggle";
import FilterBar from "../components/FilterBar";
import QuickCreate from "../components/QuickCreate";
import "../styles/projects.css";

const SORT_FNS = {
  newest: (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
  oldest: (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0),
  deadline: (a, b) => new Date(a.deadline?.split("/").reverse().join("-") || 0) - new Date(b.deadline?.split("/").reverse().join("-") || 0),
  priority: (a, b) => {
    const order = { urgent: 0, high: 1, medium: 2, low: 3 };
    return (order[a.priority] ?? 1) - (order[b.priority] ?? 1);
  },
  alpha: (a, b) => a.title?.localeCompare(b.title),
};

function ClientProjects() {
  const { query: searchQuery } = useSearch();
  const projects = useItemsByType("project", "client");
  const { addItem, updateItem } = useData();
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState("cards");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [activeTag, setActiveTag] = useState(null);

  const allTags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return [...set].sort();
  }, [projects]);

  const filtered = useMemo(() => {
    let result = [...projects];

    if (statusFilter === "active") {
      result = result.filter((p) => p.statusIndicator !== "gray" && !(p.progress?.total > 0 && p.progress?.completed === p.progress?.total));
    } else if (statusFilter === "completed") {
      result = result.filter((p) => p.progress?.total > 0 && p.progress?.completed === p.progress?.total);
    }

    if (activeTag) result = result.filter((p) => p.tags?.includes(activeTag));
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.title?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }

    const sorter = SORT_FNS[sortBy];
    if (sorter) result.sort(sorter);

    return result;
  }, [projects, statusFilter, activeTag, sortBy, searchQuery]);

  const handleCreate = (formData) => {
    addItem({
      type: "project", category: "client",
      title: formData.title,
      description: formData.description,
      progress: { completed: 0, total: 0 },
      deadline: new Date(formData.targetDeadline).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      statusIndicator: "gray",
      priority: "high",
      milestones: [],
      tasks: [],
      tags: formData.tags || [],
    });
    setShowCreate(false);
  };

  const handleQuickCreate = (title) => {
    addItem({
      type: "project", category: "client",
      title, description: "",
      progress: { completed: 0, total: 0 },
      deadline: "—", statusIndicator: "gray", priority: "high",
      milestones: [], tasks: [], tags: [],
    });
  };

  const handleUpdateProject = (id, changes) => {
    updateItem(id, changes);
  };

  if (showCreate) {
    return (
      <CreateProject
        projectType="client"
        onSubmit={handleCreate}
        onCancel={() => setShowCreate(false)}
      />
    );
  }

  return (
    <>
      <div className="PageInsight">
        <p className="PageInsight-question">What are you building?</p>
        {projects.length > 0 && (
          <div className="PageInsight-stats">
            <span className="PageInsight-stat"><strong>{projects.filter((p) => p.statusIndicator !== "gray").length}</strong> active</span>
            <span className="PageInsight-sep">·</span>
            <span className="PageInsight-stat"><strong>{projects.reduce((s, p) => s + (p.milestones?.length || 0), 0)}</strong> milestones</span>
          </div>
        )}
      </div>

      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Client Projects</h2>
        <div className="SectionHeader-actions">
          <ViewToggle active={view} onChange={setView} />
          <button className="SectionHeader-action" onClick={() => setShowCreate(true)}>+ New</button>
        </div>
      </div>

      {projects.length > 0 && (
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

      <ProjectList
        projects={filtered}
        onUpdateProject={handleUpdateProject}
        emptyMessage="No projects yet. Every masterpiece starts with one commit."
        onAddProject={() => setShowCreate(true)}
        view={view}
        searchQuery={searchQuery}
      />

      <QuickCreate onCreate={handleQuickCreate} placeholder="Client project..." />
    </>
  );
}

export default ClientProjects;
