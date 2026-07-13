import { useState, useRef } from "react";
import { ProjectCard } from "./ProjectCard";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import StatusDot from "./StatusDot";
import Tag from "./Tag";

function ProjectList({ projects, onUpdateProject, emptyMessage, onAddProject, view = "cards", searchQuery = "" }) {
  const [expandedId, setExpandedId] = useState(null);
  const [addingMilestoneFor, setAddingMilestoneFor] = useState(null);
  const idCounter = useRef(0);
  const nextId = () => `id-${++idCounter.current}`;
  const [dragIndex, setDragIndex] = useState(null);
  const [newTaskText, setNewTaskText] = useState({});
  const [newMsTaskText, setNewMsTaskText] = useState({});

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setAddingMilestoneFor(null);
  };

  const handleAddMilestone = (projectId, milestoneData) => {
    const milestone = {
      id: `ms-${nextId()}`,
      name: milestoneData.name,
      deadline: new Date(milestoneData.deadline).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      progress: { completed: 0, total: milestoneData.tasks.length },
      expanded: true,
      tasks: milestoneData.tasks.map((name, i) => ({
        id: `task-${nextId()}-${i}`,
        name,
        completed: false,
      })),
    };
    const project = projects.find((p) => p.id === projectId);
    onUpdateProject(projectId, { milestones: [...(project?.milestones || []), milestone] });
    setAddingMilestoneFor(null);
  };

  const handleAddProjectTask = (projectId) => {
    const text = newTaskText[projectId]?.trim();
    if (!text) return;
    const project = projects.find((p) => p.id === projectId);
    const task = { id: `pt-${nextId()}`, name: text, completed: false };
    onUpdateProject(projectId, { tasks: [...(project?.tasks || []), task] });
    setNewTaskText((prev) => ({ ...prev, [projectId]: "" }));
  };

  const handleToggleProjectTask = (projectId, taskId) => {
    const project = projects.find((p) => p.id === projectId);
    const tasks = (project?.tasks || []).map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    onUpdateProject(projectId, { tasks });
  };

  const handleAddMilestoneTask = (projectId, milestoneId) => {
    const key = `${projectId}-${milestoneId}`;
    const text = newMsTaskText[key]?.trim();
    if (!text) return;
    const project = projects.find((p) => p.id === projectId);
    const milestone = project?.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;
    const task = { id: `mt-${nextId()}`, name: text, completed: false };
    const updatedTasks = [...(milestone.tasks || []), task];
    const milestones = (project?.milestones || []).map((m) =>
      m.id === milestoneId
        ? { ...m, tasks: updatedTasks, progress: { completed: m.progress?.completed || 0, total: updatedTasks.length } }
        : m
    );
    onUpdateProject(projectId, { milestones });
    setNewMsTaskText((prev) => ({ ...prev, [key]: "" }));
  };

  const handleToggleMilestoneTask = (projectId, milestoneId, taskId) => {
    const project = projects.find((p) => p.id === projectId);
    const milestone = project?.milestones.find((m) => m.id === milestoneId);
    if (!milestone) return;
    const tasks = (milestone.tasks || []).map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    const completed = tasks.filter((t) => t.completed).length;
    const milestones = (project?.milestones || []).map((m) =>
      m.id === milestoneId ? { ...m, tasks, progress: { completed, total: tasks.length } } : m
    );
    onUpdateProject(projectId, { milestones });
  };

  const handleDragStart = (index) => setDragIndex(index);

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...projects];
    const [item] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, item);
    reordered.forEach((p, i) => onUpdateProject(p.id, { order: i }));
    setDragIndex(index);
  };

  const handleDragEnd = () => setDragIndex(null);

  const filtered = projects.filter((p) =>
    !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (filtered.length === 0) {
    return (
      <div className="ProjectList">
        <div className="ProjectList-empty">
          <p className="ProjectList-empty-text">{projects.length === 0 ? (emptyMessage || "No projects yet.") : "No matches found."}</p>
          <Button size="sm" onClick={onAddProject}>+ Create Project</Button>
        </div>
      </div>
    );
  }

  if (view === "list") {
    return (
      <div className="ProjectList">
        <div className="ProjectList-table">
          <div className="ProjectList-table-header">
            <span className="ProjectList-table-cell ProjectList-table-cell--wide">Name</span>
            <span className="ProjectList-table-cell">Deadline</span>
            <span className="ProjectList-table-cell">Progress</span>
            <span className="ProjectList-table-cell">Status</span>
          </div>
          {filtered.map((project, i) => (
            <div
              key={project.id}
              className="ProjectList-table-row"
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragEnd={handleDragEnd}
              onClick={() => toggleExpand(project.id)}
            >
              <span className="ProjectList-table-cell ProjectList-table-cell--wide">
                <span className="ProjectList-table-title">{project.title}</span>
                {project.tags?.length > 0 && (
                  <span className="ProjectList-table-tags">
                    {project.tags.map((t) => (<Tag key={t} label={t} />))}
                  </span>
                )}
              </span>
              <span className="ProjectList-table-cell">{project.deadline}</span>
              <span className="ProjectList-table-cell">
                <ProgressBar completed={project.progress?.completed || 0} total={project.progress?.total || 0} />
              </span>
              <span className="ProjectList-table-cell">
                <StatusDot color={project.statusIndicator} />
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === "table") {
    const cols = ["Name", "Deadline", "Milestones", "Progress", "Tags", "Status"];
    return (
      <div className="ProjectList">
        <table className="ProjectList-table-view">
          <thead>
            <tr>{cols.map((c) => (<th key={c}>{c}</th>))}</tr>
          </thead>
          <tbody>
            {filtered.map((project, i) => (
              <tr key={project.id} draggable onDragStart={() => handleDragStart(i)} onDragOver={(e) => handleDragOver(e, i)} onDragEnd={handleDragEnd}>
                <td>{project.title}</td>
                <td>{project.deadline}</td>
                <td>{project.milestones?.filter((m) => m.tasks?.every((t) => t.completed)).length || 0}/{project.milestones?.length || 0}</td>
                <td><ProgressBar completed={project.progress?.completed || 0} total={project.progress?.total || 0} /></td>
                <td>{project.tags?.length > 0 && (<div className="ProjectList-table-tags">{project.tags.map((t) => (<Tag key={t} label={t} />))}</div>)}</td>
                <td><StatusDot color={project.statusIndicator} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="ProjectList">
      <div className="ProjectList-grid">
        {filtered.map((project) => {
          const isOpen = expandedId === project.id;
          const isAdding = addingMilestoneFor === project.id;

          return (
            <ProjectCard
              key={project.id}
              project={project}
              isExpanded={isOpen}
              onToggleExpand={() => toggleExpand(project.id)}
              onAddProjectTask={() => handleAddProjectTask(project.id)}
              onToggleProjectTask={(taskId) => handleToggleProjectTask(project.id, taskId)}
              onAddMilestoneTask={(milestoneId) => handleAddMilestoneTask(project.id, milestoneId)}
              onToggleMilestoneTask={(milestoneId, taskId) => handleToggleMilestoneTask(project.id, milestoneId, taskId)}
              onSubmitAddMilestone={(data) => handleAddMilestone(project.id, data)}
              onCancelAddMilestone={() => setAddingMilestoneFor(null)}
              newProjectTaskText={newTaskText[project.id] || ""}
              onNewProjectTaskTextChange={(val) => setNewTaskText((prev) => ({ ...prev, [project.id]: val }))}
              newMilestoneTaskTexts={Object.fromEntries(
                (project.milestones || []).map((ms) => [`${project.id}-${ms.id}`, newMsTaskText[`${project.id}-${ms.id}`] || ""])
              )}
              onNewMilestoneTaskTextChange={(milestoneId, val) =>
                setNewMsTaskText((prev) => ({ ...prev, [`${project.id}-${milestoneId}`]: val }))
              }
              onAddMilestone={() => setAddingMilestoneFor(project.id)}
              showAddMilestoneForm={isAdding}
              canEdit={true}
            />
          );
        })}
      </div>
    </div>
  );
}

export default ProjectList;