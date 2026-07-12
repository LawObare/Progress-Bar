/*
  ─── Create Routine Goal (shared by Open Source & Networking) ───

  API: POST /routines
  Request body:
  {
    title: string,
    repeat: "Daily" | "Weekly" | "Monthly" | "Custom",
    category: string,
    startDate: string,      // ISO date
    targetEndDate?: string, // ISO date
  }
  Response: RoutineGoal

  API: GET /routines
  Response: RoutineGoal[]
  {
    id, title, category, repeat, nextDue: string, streak: number
  }
*/
import { useState } from "react";
import Card from "./Card";
import Button from "./Button";

const REPEAT_OPTIONS = ["Daily", "Weekly", "Monthly", "Custom"];

function CreateRoutineGoal({ defaultCategory, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    repeat: "Weekly",
    category: defaultCategory ?? "",
    startDate: "",
    targetEndDate: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* API: POST /routines { ...form } */
    onSubmit?.(form);
  };

  return (
    <div className="CreateRoutine">
      <Card className="CreateRoutine-card">
        <h2 className="CreateRoutine-title">Create Routine Goal</h2>
        <form onSubmit={handleSubmit} className="CreateRoutine-form">
          <div className="CreateRoutine-field">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Weekly LinkedIn Post"
              required
            />
          </div>

          <div className="CreateRoutine-field">
            <label>Repeat</label>
            <div className="CreateRoutine-radios">
              {REPEAT_OPTIONS.map((opt) => (
                <label key={opt} className="CreateRoutine-radio">
                  <input
                    type="radio"
                    name="repeat"
                    value={opt}
                    checked={form.repeat === opt}
                    onChange={handleChange("repeat")}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          <div className="CreateRoutine-field">
            <label>Category</label>
            <select value={form.category} onChange={handleChange("category")}>
              <option value="Open Source">Open Source</option>
              <option value="Networking">Networking</option>
              <option value="Personal">Personal</option>
              <option value="Learning">Learning</option>
            </select>
          </div>

          <div className="CreateRoutine-field">
            <label>Start Date</label>
            <input
              type="date"
              value={form.startDate}
              onChange={handleChange("startDate")}
              required
            />
          </div>

          <div className="CreateRoutine-field">
            <label>
              Target End Date{" "}
              <span className="CreateRoutine-opt">(Optional)</span>
            </label>
            <input
              type="date"
              value={form.targetEndDate}
              onChange={handleChange("targetEndDate")}
            />
          </div>

          <div className="CreateRoutine-actions">
            <Button type="submit">Create Routine</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateRoutineGoal;
