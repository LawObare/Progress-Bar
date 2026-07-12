/*
  ─── Self Learning — Detail View (expanded) ───

  API: GET /learning/:id
  Response shape:
  {
    id, title,
    progress: { completed, total },
    progressUnit,
    source: { type, name? },
    targetDate,
    estimatedCompletion: string,
    todayGoal: { label: string, completed: boolean } | null,
    schedule: string,           // e.g. "3 Chapters / Week"
    notes: Array<{ id, content, createdAt }>,
  }

  API: PATCH /learning/:id/today-goal  { completed: true }
  API: POST /learning/:id/notes        { content: string }
  API: DELETE /notes/:id
  API: PUT /learning/:id               — full update (Edit button)
*/

import { useState } from "react";
import Card from "./Card";
import Button from "./Button";

function LearningDetail({ goal, onBack }) {
  const [todayDone, setTodayDone] = useState(goal.todayGoal?.completed ?? false);
  const [notes, setNotes] = useState(goal.notes ?? []);
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  const handleToggleToday = () => {
    /* API: PATCH /learning/:id/today-goal { completed: !todayDone } */
    setTodayDone((prev) => !prev);
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    /* API: POST /learning/:id/notes { content: newNote } */
    const note = {
      id: `note-${Date.now()}`,
      content: newNote,
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, note]);
    setNewNote("");
    setShowNoteInput(false);
  };

  const handleDeleteNote = (noteId) => {
    /* API: DELETE /notes/:id */
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
  };

  const pct = goal.progress.total > 0
    ? Math.round((goal.progress.completed / goal.progress.total) * 100)
    : 0;

  return (
    <div className="LearningDetail">
      <button className="LearningDetail-back" onClick={onBack}>
        ← Back to Learning Goals
      </button>

      <Card className="LearningDetail-card">
        <div className="LearningDetail-header">
          <h2 className="LearningDetail-title">{goal.title}</h2>
          <Button variant="secondary" size="sm">
            {/* API: navigates to edit form pre-filled with goal data */}
            Edit
          </Button>
        </div>

        <div className="LearningDetail-grid">
          <div className="LearningDetail-field">
            <span className="LearningDetail-label">Source</span>
            <span className="LearningDetail-value">
              {goal.source.name
                ? `${goal.source.type} • ${goal.source.name}`
                : goal.source.type}
            </span>
          </div>

          <div className="LearningDetail-field">
            <span className="LearningDetail-label">Progress</span>
            <span className="LearningDetail-value">
              {goal.progress.completed} / {goal.progress.total} {goal.progressUnit}
            </span>
            <div className="LearningDetail-bar-track">
              <div
                className="LearningDetail-bar-fill"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="LearningDetail-field">
            <span className="LearningDetail-label">Target Date</span>
            <span className="LearningDetail-value">{goal.targetDate}</span>
          </div>

          <div className="LearningDetail-field">
            <span className="LearningDetail-label">Estimated Completion</span>
            <span className="LearningDetail-value LearningDetail-estimated">
              {goal.estimatedCompletion} ✅
            </span>
          </div>
        </div>

        {/* ─── Today's Goal ─── */}
        {goal.todayGoal && (
          <div className="LearningDetail-today">
            <h4>Today&apos;s Goal</h4>
            <label className="LearningDetail-today-check">
              <input
                type="checkbox"
                checked={todayDone}
                onChange={handleToggleToday}
              />
              <span className={todayDone ? "LearningDetail-today--done" : ""}>
                {goal.todayGoal.label}
              </span>
            </label>
          </div>
        )}

        {/* ─── Study Schedule ─── */}
        <div className="LearningDetail-schedule">
          <h4>Study Schedule</h4>
          <span className="LearningDetail-schedule-value">
            {goal.schedule}
          </span>
        </div>

        {/* ─── Notes ─── */}
        <div className="LearningDetail-notes">
          <h4>Notes</h4>
          {notes.length > 0 ? (
            <ul className="LearningDetail-notes-list">
              {notes.map((note) => (
                <li key={note.id} className="LearningDetail-note">
                  <p>{note.content}</p>
                  <button
                    className="LearningDetail-note-del"
                    onClick={() => handleDeleteNote(note.id)}
                    title="Delete note"
                  >
                    ✕
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="LearningDetail-notes-empty">No notes yet.</p>
          )}

          {showNoteInput ? (
            <div className="LearningDetail-note-form">
              <textarea
                className="LearningDetail-note-input"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write your note..."
                rows={3}
              />
              <div className="LearningDetail-note-actions">
                <Button size="sm" onClick={handleAddNote}>
                  Save Note
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setShowNoteInput(false);
                    setNewNote("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setShowNoteInput(true)}
            >
              + Add Note
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default LearningDetail;
