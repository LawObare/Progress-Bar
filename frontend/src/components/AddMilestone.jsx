/*
  ─── Add Milestone (within a project) ───

  API: POST /projects/:id/milestones
  Request body:
  {
    name: string,
    deadline: string,       // ISO date
    tasks: string[],        // task names
  }
  Response: Milestone
  {
    id, name, deadline,
    progress: { completed, total },
    expanded: boolean,
    tasks: Array<{ id, name, completed }>
  }

  Usage: Tasks are added one at a time via "+ Add Task".
  The form collects name + deadline + task list, then submits all at once.
*/
import { useState } from "react";
import Card from "./Card";
import Button from "./Button";

function AddMilestone({ onSubmit, onCancel }) {
  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState("");

  const handleAddTask = () => {
    if (!currentTask.trim()) return;
    setTasks((prev) => [...prev, currentTask.trim()]);
    setCurrentTask("");
  };

  const handleRemoveTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTaskKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTask();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* API: POST /projects/:id/milestones */
    onSubmit?.({ name, deadline, tasks });
  };

  return (
    <Card className="AddMilestone">
      <h3 className="AddMilestone-title">Add Milestone</h3>

      <form onSubmit={handleSubmit} className="AddMilestone-form">
        <div className="AddMilestone-field">
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. UI / UX"
            required
          />
        </div>

        <div className="AddMilestone-field">
          <label>Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>

        <div className="AddMilestone-field">
          <label>Tasks</label>
          <div className="AddMilestone-tasks-list">
            {tasks.length > 0 ? (
              tasks.map((task, i) => (
                <div key={i} className="AddMilestone-task-item">
                  <span>{task}</span>
                  <button
                    type="button"
                    className="AddMilestone-task-remove"
                    onClick={() => handleRemoveTask(i)}
                  >
                    ✕
                  </button>
                </div>
              ))
            ) : (
              <span className="AddMilestone-tasks-empty">No tasks added yet</span>
            )}
          </div>

          <div className="AddMilestone-task-input-row">
            <input
              type="text"
              value={currentTask}
              onChange={(e) => setCurrentTask(e.target.value)}
              onKeyDown={handleTaskKeyDown}
              placeholder="Type a task and press Enter"
            />
            <Button type="button" size="sm" variant="secondary" onClick={handleAddTask}>
              + Add Task
            </Button>
          </div>
        </div>

        <div className="AddMilestone-actions">
          <Button type="submit">Save Milestone</Button>
          <Button type="button" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default AddMilestone;
