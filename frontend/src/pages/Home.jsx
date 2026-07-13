import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import { ProjectCard } from "../components/ProjectCard";
import "../styles/home.css";

function isInPast(dateStr) {
  if (!dateStr || dateStr === "—") return false;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return false;
  const deadlineMidnight = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const todayMidnight = new Date();
  todayMidnight.setHours(0, 0, 0, 0);
  return deadlineMidnight < todayMidnight;
}

function Home() {
  const { user } = useAuth();
  const { items, updateItem } = useData();
  const [expandedId, setExpandedId] = useState(null);
  const [addingMilestoneFor, setAddingMilestoneFor] = useState(null);
  const [newTaskText, setNewTaskText] = useState({});
  const [newMsTaskText, setNewMsTaskText] = useState({});
  const idCounter = useRef(0);
  const nextId = () => `id-${++idCounter.current}`;
  const name = user?.name || "developer";

  const itemsArr = items || [];
  const projects = itemsArr.filter((i) => i.type === "project");
  const goals = itemsArr.filter((i) => i.type === "goal");
  const routines = itemsArr.filter((i) => i.type === "routine");
  const events = itemsArr.filter((i) => i.type === "event");

  const needsAttentionList = projects.filter((p) => {
    const projectOverdue = isInPast(p.deadline) && (p.progress?.completed < p.progress?.total);
    const hasOverdueMilestone = p.milestones?.some((m) => {
      const mIncomplete = m.tasks?.some((t) => !t.completed);
      return isInPast(m.deadline) && mIncomplete;
    });
    return projectOverdue || hasOverdueMilestone;
  });

  const todayTasks = [
    ...projects.slice(0, 1),
    ...goals.filter((g) => g.category === "learning").slice(0, 1)
  ];

  const upcomingEvents = events
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 2);

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
    updateItem(projectId, { milestones: [...(project?.milestones || []), milestone] });
    setAddingMilestoneFor(null);
  };

  const handleAddProjectTask = (projectId) => {
    const text = newTaskText[projectId]?.trim();
    if (!text) return;
    const project = projects.find((p) => p.id === projectId);
    const task = { id: `pt-${nextId()}`, name: text, completed: false };
    updateItem(projectId, { tasks: [...(project?.tasks || []), task] });
    setNewTaskText((prev) => ({ ...prev, [projectId]: "" }));
  };

  const handleToggleProjectTask = (projectId, taskId) => {
    const project = projects.find((p) => p.id === projectId);
    const tasks = (project?.tasks || []).map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    updateItem(projectId, { tasks });
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
    updateItem(projectId, { milestones });
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
    updateItem(projectId, { milestones });
  };

  const toggleComplete = (item, type = "item", parentId = null, milestoneId = null) => {
    if (type === "item") {
      updateItem(item.id, { completed: !item.completed });
    } else if (type === "projectTask") {
      handleToggleProjectTask(parentId, item.id);
    } else if (type === "milestoneTask") {
      handleToggleMilestoneTask(parentId, milestoneId, item.id);
    }
  };

  return (
    <div className="Home">
      <header className="Home-header">
        <h1 className="Home-greeting">👋 Welcome back, {name}</h1>
        <p className="Home-motto">&ldquo;Small commits lead to big projects.&rdquo;</p>
      </header>

      <div className="Home-divider">------------------------------------------------------------------</div>

      <section className="Home-section">
        <h2 className="Home-section-title">📋 Today&apos;s Tasks</h2>
        {todayTasks.length > 0 ? todayTasks.map((item) => (
          <div key={item.id} className="Home-card">
            <div className="Home-card-content">
              <div className="Home-card-header">
                <span className="Home-card-title">{item.title}</span>
                <span className="Home-card-category">{item.category}</span>
              </div>
              <div className="Home-card-footer">
                <span className="Home-card-meta">Due Today</span>
                <button
                  className={`Home-card-toggle ${item.completed ? "is-complete" : ""}`}
                  onClick={(e) => { e.stopPropagation(); toggleComplete(item); }}
                >
                  {item.completed ? "☑" : "☐"} Complete
                </button>
              </div>
            </div>
          </div>
        )) : (
          <p className="Home-empty">No tasks for today. Start something new?</p>
        )}
      </section>

      {needsAttentionList.length > 0 && (
        <>
          <div className="Home-divider">------------------------------------------------------------------</div>
          <section className="Home-section">
            <h2 className="Home-section-title">⚠️ Needs Attention</h2>
            {needsAttentionList.map((project) => {
              const isExpanded = expandedId === project.id;
              const isAdding = addingMilestoneFor === project.id;
              return (
                <ProjectCard
                  key={project.id}
                  project={project}
                  isExpanded={isExpanded}
                  onToggleExpand={() => setExpandedId(isExpanded ? null : project.id)}
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
          </section>
        </>
      )}

      <div className="Home-divider">------------------------------------------------------------------</div>

      <section className="Home-section">
        <h2 className="Home-section-title">🔄 Routine Goals</h2>
        {routines.slice(0, 2).map((routine) => (
          <div key={routine.id} className="Home-card">
            <div className="Home-card-content">
              <div className="Home-card-header">
                <span className="Home-card-title">{routine.title}</span>
                <span className="Home-card-category">{routine.category}</span>
              </div>
              <div className="Home-card-footer">
                <span className="Home-card-meta">Every {routine.frequency || "Day"}</span>
                <button
                  className={`Home-card-toggle ${routine.completed ? "is-complete" : ""}`}
                  onClick={() => toggleComplete(routine)}
                >
                  {routine.completed ? "☑" : "☐"} Complete
                </button>
              </div>
            </div>
          </div>
        ))}
        {routines.length === 0 && <p className="Home-empty">No routine goals set.</p>}
      </section>

      <div className="Home-divider">------------------------------------------------------------------</div>

      <section className="Home-section">
        <h2 className="Home-section-title">📅 Upcoming Events</h2>
        {upcomingEvents.map((event) => (
          <div key={event.id} className="Home-card">
            <div className="Home-card-content">
              <div className="Home-card-header">
                <span className="Home-card-title">{event.title}</span>
              </div>
              <div className="Home-card-footer">
                <span className="Home-card-meta">📅 {event.date}</span>
                <span className="Home-card-meta">{event.daysLeft || 0} days left</span>
              </div>
            </div>
          </div>
        ))}
        {upcomingEvents.length === 0 && <p className="Home-empty">No upcoming events.</p>}
      </section>

      <div className="Home-divider">------------------------------------------------------------------</div>

      <section className="Home-wisdom">
        <h2 className="Home-wisdom-title">💡 Today&apos;s Dev Wisdom</h2>
        <p className="Home-wisdom-text">
          &ldquo;Life is like Git... you have to commit before you can push.&rdquo;
        </p>
      </section>
    </div>
  );
}

export default Home;