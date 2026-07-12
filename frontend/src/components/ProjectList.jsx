/*
  Shared component for both Personal Projects and Client Projects.

  API: GET /projects?type=personal|client
  API: GET /projects/:id         → includes milestones & tasks
  API: POST /projects/:id/milestones
  API: PATCH /tasks/:id          → { completed: true/false }

  Props:
    projects: Project[]
    setProjects: fn              — to update milestones
    title: string
    onAddProject: fn
*/

import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import ProgressBar from "./ProgressBar";
import StatusDot from "./StatusDot";
import AddMilestone from "./AddMilestone";

function ProjectList({ projects, setProjects, title, emptyMessage, onAddProject }) {
  const [expandedId, setExpandedId] = useState(null);
  const [addingMilestoneFor, setAddingMilestoneFor] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
    setAddingMilestoneFor(null);
  };

  const handleAddMilestone = (projectId, milestoneData) => {
    /* API: POST /projects/:id/milestones */
    const milestone = {
      id: `ms-${Date.now()}`,
      name: milestoneData.name,
      deadline: new Date(milestoneData.deadline).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      progress: { completed: 0, total: milestoneData.tasks.length },
      expanded: true,
      tasks: milestoneData.tasks.map((name, i) => ({
        id: `task-${Date.now()}-${i}`,
        name,
        completed: false,
      })),
    };

    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId
          ? { ...p, milestones: [...p.milestones, milestone] }
          : p
      )
    );
    setAddingMilestoneFor(null);
  };

  return (
    <div className="ProjectList">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">{title}</h2>
        <Button size="sm" onClick={onAddProject}>
          + Project
        </Button>
      </div>

      {projects.length === 0 ? (
        <div className="ProjectList-empty">
          <p className="ProjectList-empty-text">{emptyMessage || "No projects yet."}</p>
          <Button size="sm" onClick={onAddProject}>+ Create Project</Button>
        </div>
      ) : (
        <div className="ProjectList-grid">
          {projects.map((project) => {
            const isOpen = expandedId === project.id;
            const isAdding = addingMilestoneFor === project.id;

            return (
              <Card
                key={project.id}
                className={`ProjectCard ${isOpen ? "ProjectCard--expanded" : ""}`}
              >
                {/* ─── Card Header ─── */}
                <div
                  className="ProjectCard-header"
                  onClick={() => toggleExpand(project.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && toggleExpand(project.id)}
                >
                  <div className="ProjectCard-header-left">
                    <StatusDot color={project.statusIndicator} />
                    <div>
                      <span className="ProjectCard-title">{project.title}</span>
                      <span className="ProjectCard-deadline">
                        Deadline: {project.deadline}
                      </span>
                    </div>
                  </div>
                  <div className="ProjectCard-header-right">
                    <span className="ProjectCard-milestone-count">
                      {
                        project.milestones.filter((m) =>
                          m.tasks.length > 0 && m.tasks.every((t) => t.completed)
                        ).length
                      }
                      /{project.milestones.length} milestones
                    </span>
                    <span className="ProjectCard-chevron">
                      {isOpen ? "▼" : "▶"}
                    </span>
                  </div>
                </div>

                {/* ─── Expanded Detail ─── */}
                {isOpen && (
                  <div className="ProjectCard-detail">
                    <p className="ProjectCard-desc">{project.description}</p>

                    <div className="ProjectCard-milestones-header">
                      <h4>Milestones</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAddingMilestoneFor(project.id)}
                      >
                        + Add
                      </Button>
                    </div>

                    {project.milestones.map((ms) => (
                      <MilestoneRow key={ms.id} milestone={ms} />
                    ))}

                    {isAdding ? (
                      <AddMilestone
                        onSubmit={(data) => handleAddMilestone(project.id, data)}
                        onCancel={() => setAddingMilestoneFor(null)}
                      />
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setAddingMilestoneFor(project.id)}
                        className="ProjectCard-add-milestone"
                      >
                        + Add Milestone
                      </Button>
                    )}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

/*
  Milestone row with collapsible tasks.
  API: GET /milestones/:id    → { tasks }
  API: PUT /tasks/:id         → { completed }
*/
function MilestoneRow({ milestone }) {
  const [expanded, setExpanded] = useState(milestone.expanded);
  const [tasks, setTasks] = useState(milestone.tasks);

  const toggleTask = (taskId) => {
    /* API: PUT /tasks/:id { completed: !current } */
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      )
    );
  };

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
        <ProgressBar
          completed={milestone.progress.completed}
          total={milestone.progress.total}
        />
        <span className="Milestone-deadline">{milestone.deadline}</span>
      </div>

      {expanded && (
        <div className="Milestone-tasks">
          {tasks.map((task) => (
            <label key={task.id} className="Milestone-task">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className={task.completed ? "Milestone-task--done" : ""}>
                {task.name}
              </span>
            </label>
          ))}
          {tasks.length === 0 && (
            <span className="Milestone-empty">No tasks yet</span>
          )}
          <Button size="sm" variant="ghost">+ Add Task</Button>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
