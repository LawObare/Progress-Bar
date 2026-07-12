/*
  ─── Career Page ───

  API: GET /career
  Response: CareerGoal[]
  { id, title, type, deadline, notes?, statusDot, status }

  API: POST /career
  Body: { title, type, deadline, notes }
  Response: CareerGoal

  API: PUT /career/:id
  API: DELETE /career/:id
*/

import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import StatusDot from "../components/StatusDot";
import "../styles/career.css";

const CAREER_TYPES = [
  "Resume", "Portfolio", "Interview",
  "Job Application", "Certification", "Practice", "Other",
];

function Career() {
  const [goals, setGoals] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const handleCreate = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    /* API: POST /career */
    const goal = {
      id: `career-${Date.now()}`,
      title: fd.get("title"),
      type: fd.get("type"),
      deadline: new Date(fd.get("deadline")).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      notes: fd.get("notes"),
      statusDot: "gray",
      status: "not_started",
    };
    setGoals((prev) => [...prev, goal]);
    setShowCreate(false);
  };

  if (showCreate) {
    return (
      <div className="Career">
        <Card className="Career-create-card">
          <h2 className="Career-create-title">Create Career Goal</h2>
          <form onSubmit={handleCreate} className="Career-create-form">
            <div className="Career-field">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Update Resume"
                required
              />
            </div>

            <div className="Career-field">
              <label>Type</label>
              <div className="Career-types">
                {CAREER_TYPES.map((t) => (
                  <label key={t} className="Career-type-radio">
                    <input
                      type="radio"
                      name="type"
                      value={t}
                      defaultChecked={t === "Resume"}
                    />
                    {t}
                  </label>
                ))}
              </div>
            </div>

            <div className="Career-field">
              <label>Deadline</label>
              <input type="date" name="deadline" required />
            </div>

            <div className="Career-field">
              <label>Notes <span className="Career-opt">(Optional)</span></label>
              <textarea
                name="notes"
                rows={4}
                placeholder="Any additional details..."
              />
            </div>

            <div className="Career-create-actions">
              <Button type="submit">Create Career Goal</Button>
              <Button type="button" variant="ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="Career">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Career</h2>
        <Button size="sm" onClick={() => setShowCreate(true)}>+ Create</Button>
      </div>

      {goals.length === 0 ? (
        <div className="Career-empty">
          <p className="Career-empty-text">Your future employer hasn&apos;t met you yet.</p>
          <Button size="sm" onClick={() => setShowCreate(true)}>+ Create Career Goal</Button>
        </div>
      ) : (
        <div className="Career-grid">
          {goals.map((goal) => (
            <Card key={goal.id} className="Career-card">
              <div className="Career-card-body">
                <StatusDot color={goal.statusDot} />
                <div className="Career-card-info">
                  <span className="Career-card-title">{goal.title}</span>
                  <div className="Career-card-meta">
                    <span className="Career-card-type">{goal.type}</span>
                    <span className="Career-card-deadline">
                      Deadline: {goal.deadline}
                    </span>
                  </div>
                </div>
              </div>
              <span className="Career-card-chevron">▶</span>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default Career;
