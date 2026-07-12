/*
  ─── Create Project (shared: Personal & Client) ───

  API: POST /projects
  Request body:
  {
    type: "personal" | "client",
    title: string,
    description: string,
    targetDeadline: string,    // ISO date
    milestones?: Array<{
      name: string,
      deadline: string,
      tasks: string[],         // task names
    }>,
  }
  Response: Project
*/
import { useState } from "react";
import Card from "./Card";
import Button from "./Button";

function CreateProject({ projectType, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    targetDeadline: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* API: POST /projects { type: projectType, ...form } */
    onSubmit?.({ ...form, type: projectType });
  };

  return (
    <div className="CreateProject">
      <Card className="CreateProject-card">
        <h2 className="CreateProject-title">Create Project</h2>

        <form onSubmit={handleSubmit} className="CreateProject-form">
          <div className="CreateProject-field">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Progress Bar"
              required
            />
          </div>

          <div className="CreateProject-field">
            <label>Description</label>
            <textarea
              value={form.description}
              onChange={handleChange("description")}
              placeholder="Goal tracking app for developers..."
              rows={4}
            />
          </div>

          <div className="CreateProject-field">
            <label>Target Deadline</label>
            <input
              type="date"
              value={form.targetDeadline}
              onChange={handleChange("targetDeadline")}
              required
            />
          </div>

          <div className="CreateProject-actions">
            <Button type="submit">Create Project</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateProject;
