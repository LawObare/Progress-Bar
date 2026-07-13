import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import StatusDot from "./StatusDot";
import Tag from "./Tag";
import AddMilestone from "./AddMilestone";

function MilestoneRow({ milestone, onToggleTask, onAddTask, newTaskText, onNewTaskTextChange }) {
  const [expanded, setExpanded] = useState(milestone.expanded);
  const tasks = milestone.tasks || [];

  return (
    <div className="Milestone">
      <div
        className="Milestone-header"
        onClick={() => setExpanded((prev) => !prev)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && setExpanded((prev) => !prev)}
      >
        <span className="Milestone-chevron">{expanded ? "▼" : "▶"}</span>
        <span className="Milestone-name">{milestone.name}</span>
        <ProgressBar completed={milestone.progress?.completed || 0} total={milestone.progress?.total || 0} />
        <span className="Milestone-deadline">{milestone.deadline}</span>
      </div>

      {expanded && (
        <div className="Milestone-tasks">
          {tasks.map((task) => (
            <label key={task.id} className="Milestone-task">
              <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
              <span className={task.completed ? "Milestone-task--done" : ""}>{task.name}</span>
            </label>
          ))}
          {tasks.length === 0 && <span className="Milestone-empty">No tasks yet</span>}
          <div className="Milestone-task-input">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => onNewTaskTextChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onAddTask()}
              placeholder="Add a task..."
            />
            <Button size="sm" disabled={!newTaskText.trim()} onClick={onAddTask}>
              + Add
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  project,
  isExpanded,
  onToggleExpand,
  onAddProjectTask,
  onToggleProjectTask,
  onAddMilestoneTask,
  onToggleMilestoneTask,
  onSubmitAddMilestone,
  onCancelAddMilestone,
  newProjectTaskText,
  onNewProjectTaskTextChange,
  newMilestoneTaskTexts,
  onNewMilestoneTaskTextChange,
  onAddMilestone,
  showAddMilestoneForm,
  canEdit = true
}) {
  const projectTasks = project.tasks || [];
  const milestones = project.milestones || [];

  return (
    <Card className={`ProjectCard ${isExpanded ? "ProjectCard--expanded" : ""}`}>
      <div
        className="ProjectCard-header"
        draggable
        onClick={onToggleExpand}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggleExpand()}
      >
        <div className="ProjectCard-header-left">
          <StatusDot color={project.statusIndicator} />
          <div>
            <span className="ProjectCard-title">{project.title}</span>
            <span className="ProjectCard-deadline">Deadline: {project.deadline}</span>
            {project.tags?.length > 0 && (
              <div className="ProjectCard-tags">{project.tags.map((t) => (<Tag key={t} label={t} />))}</div>
            )}
          </div>
        </div>
        <div className="ProjectCard-header-right">
          <span className="ProjectCard-milestone-count">
            {milestones.filter((m) => m.tasks?.length > 0 && m.tasks.every((t) => t.completed)).length}/{milestones.length} milestones
          </span>
          <span className="ProjectCard-chevron">{isExpanded ? "▼" : "▶"}</span>
        </div>
      </div>

      {isExpanded && (
        <div className="ProjectCard-detail">
          <p className="ProjectCard-desc">{project.description}</p>

          {/* ─── Project-level Tasks ─── */}
          <div className="ProjectCard-tasks-section">
            <div className="ProjectCard-tasks-header">
              <h4>Tasks</h4>
            </div>
            <div className="ProjectCard-tasks-list">
              {projectTasks.map((task) => (
                <label key={task.id} className="ProjectCard-task">
                  <input type="checkbox" checked={task.completed} onChange={() => onToggleProjectTask(task.id)} />
                  <span className={task.completed ? "ProjectCard-task--done" : ""}>{task.name}</span>
                </label>
              ))}
              {projectTasks.length === 0 && <span className="ProjectCard-tasks-empty">No tasks yet</span>}
            </div>
            {canEdit && (
              <div className="ProjectCard-task-input-row">
                <input
                  type="text"
                  value={newProjectTaskText}
                  onChange={(e) => onNewProjectTaskTextChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onAddProjectTask()}
                  placeholder="Add a task..."
                />
                <Button size="sm" onClick={onAddProjectTask} disabled={!newProjectTaskText.trim()}>
                  + Add
                </Button>
              </div>
            )}
          </div>

          {/* ─── Milestones ─── */}
          <div className="ProjectCard-milestones-header">
            <h4>Milestones</h4>
            {canEdit && <Button size="sm" variant="ghost" onClick={onAddMilestone}>+ Add</Button>}
          </div>

          {milestones.map((ms) => (
            <MilestoneRow
              key={ms.id}
              milestone={ms}
              onToggleTask={(taskId) => onToggleMilestoneTask(ms.id, taskId)}
              onAddTask={() => onAddMilestoneTask(ms.id)}
              newTaskText={newMilestoneTaskTexts[`${project.id}-${ms.id}`] || ""}
              onNewTaskTextChange={(val) => onNewMilestoneTaskTextChange(ms.id, val)}
            />
          ))}

          {showAddMilestoneForm ? (
            <AddMilestone onSubmit={onSubmitAddMilestone} onCancel={onCancelAddMilestone} />
          ) : canEdit && (
            <Button size="sm" variant="ghost" onClick={onAddMilestone} className="ProjectCard-add-milestone">
              + Add Milestone
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

export { ProjectCard, MilestoneRow };