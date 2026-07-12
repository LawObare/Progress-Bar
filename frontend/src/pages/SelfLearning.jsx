/*
  ─── Self Learning Page ───

  States:
    1. List — shows all learning goals as cards. Click card → detail.
    2. Detail — expanded view of a single goal (source, progress, today goal, notes).
    3. Create — form to add a new learning goal.

  API:
    GET    /learning              → LearningGoal[]
    POST   /learning              → LearningGoal
    GET    /learning/:id          → LearningGoal (with notes)
    PUT    /learning/:id          → LearningGoal
    DELETE /learning/:id
    PATCH  /learning/:id/today-goal  → { completed: boolean }
    POST   /learning/:id/notes    → Note
    DELETE /notes/:id
*/

import { useState } from "react";
import LearningCard from "../components/LearningCard";
import LearningDetail from "../components/LearningDetail";
import CreateLearningGoal from "../components/CreateLearningGoal";
import Button from "../components/Button";
import "../styles/learning.css";

function SelfLearning() {
  const [goals, setGoals] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const selectedGoal = goals.find((g) => g.id === selectedId) ?? null;

  const handleCreate = (formData) => {
    /*
      API: POST /learning
      Body: { title, sourceType, sourceName, progressType, completed, total, studyFrequency, targetDate }
      Response: LearningGoal (with generated id)
    */
    const newGoal = {
      id: `goal-${Date.now()}`,
      title: formData.title,
      progress: { completed: formData.completed, total: Number(formData.total) },
      progressUnit: formData.progressType,
      source: {
        type: formData.sourceType,
        name: formData.sourceName || undefined,
      },
      statusDot: "gray",
      targetDate: new Date(formData.targetDate).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      estimatedCompletion: "—",
      todayGoal: null,
      schedule: formData.studyFrequency,
      notes: [],
    };

    setGoals((prev) => [...prev, newGoal]);
    setShowCreate(false);
  };

  const handleSelect = (id) => {
    /*
      API: GET /learning/:id
      Returns full goal detail including notes, todayGoal, schedule.
    */
    setSelectedId(id);
  };

  const handleBack = () => {
    setSelectedId(null);
  };

  if (selectedGoal) {
    return (
      <LearningDetail goal={selectedGoal} onBack={handleBack} />
    );
  }

  if (showCreate) {
    return (
      <CreateLearningGoal
        onSubmit={handleCreate}
        onCancel={() => setShowCreate(false)}
      />
    );
  }

  return (
    <div className="LearningList">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Self Learning</h2>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          + Create
        </Button>
      </div>

      {goals.length === 0 ? (
        <div className="LearningList-empty">
          <p className="LearningList-empty-text">Ready to learn something new?</p>
          <Button size="sm" onClick={() => setShowCreate(true)}>+ Create Learning Goal</Button>
        </div>
      ) : (
        <div className="LearningList-grid">
          {goals.map((goal) => (
            <LearningCard
              key={goal.id}
              goal={goal}
              onSelect={handleSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default SelfLearning;
