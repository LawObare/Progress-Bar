/*
  ─── Self Learning — Create Form ───

  API: POST /learning
  Request body:
  {
    title: string,
    sourceType: "Book" | "Course" | "Documentation" | "Tutorial" | "Video" | "Practice",
    sourceName?: string,
    progressType: "Lessons" | "Chapters" | "Modules" | "Videos" | "Exercises" | "Sections",
    completed: number,
    total: number,
    studyFrequency: string,     // e.g. "3 per Week"
    targetDate: string,         // ISO date
  }

  Response: LearningGoal (full object with id)
*/
import { useState } from "react";
import Card from "./Card";
import Button from "./Button";
import TagInput from "./TagInput";

const SOURCE_TYPES = [
  "Book", "Course", "Documentation", "Tutorial", "Video", "Practice",
];

const PROGRESS_TYPES = [
  "Lessons", "Chapters", "Modules", "Videos", "Exercises", "Sections",
];

const STUDY_FREQUENCIES = [
  "1 per Week", "2 per Week", "3 per Week",
  "4 per Week", "5 per Week", "Daily",
];

function CreateLearningGoal({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    sourceType: "Course",
    sourceName: "",
    progressType: "Lessons",
    completed: 0,
    total: "",
    studyFrequency: "3 per Week",
    targetDate: "",
    tags: [],
  });

  const handleChange = (field) => (e) => {
    const value = field === "completed" ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* API: POST /learning { ...form } */
    onSubmit?.(form);
  };

  return (
    <div className="CreateLearning">
      <Card className="CreateLearning-card">
        <h2 className="CreateLearning-title">Create Learning Goal</h2>
        <form onSubmit={handleSubmit} className="CreateLearning-form">
          <div className="CreateLearning-field">
            <label>Title</label>
            <input
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              placeholder="e.g. Learn Go"
              required
            />
          </div>

          <div className="CreateLearning-field">
            <label>Source Type</label>
            <select value={form.sourceType} onChange={handleChange("sourceType")}>
              {SOURCE_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="CreateLearning-field">
            <label>Source Name <span className="CreateLearning-opt">(Optional)</span></label>
            <input
              type="text"
              value={form.sourceName}
              onChange={handleChange("sourceName")}
              placeholder="e.g. Let's Go"
            />
          </div>

          <div className="CreateLearning-field">
            <label>Progress Type</label>
            <select value={form.progressType} onChange={handleChange("progressType")}>
              {PROGRESS_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="CreateLearning-row">
            <div className="CreateLearning-field">
              <label>Completed</label>
              <input
                type="number"
                min="0"
                value={form.completed}
                onChange={handleChange("completed")}
              />
            </div>
            <div className="CreateLearning-field">
              <label>Total</label>
              <input
                type="number"
                min="0"
                value={form.total}
                onChange={handleChange("total")}
                placeholder="e.g. 20"
                required
              />
            </div>
          </div>

          <div className="CreateLearning-field">
            <label>Study Frequency</label>
            <select value={form.studyFrequency} onChange={handleChange("studyFrequency")}>
              {STUDY_FREQUENCIES.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="CreateLearning-field">
            <label>Target Date</label>
            <input
              type="date"
              value={form.targetDate}
              onChange={handleChange("targetDate")}
              required
            />
          </div>

          <div className="CreateLearning-field">
            <label>Tags</label>
            <TagInput
              tags={form.tags}
              onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
            />
          </div>

          <div className="CreateLearning-actions">
            <Button type="submit">Create Learning Goal</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateLearningGoal;
