/*
  API: GET /goals?status=active&sort=priority,deadline&limit=10    → todayTasks
  API: GET /goals?status=overdue,urgent&sort=deadline              → needsAttention
  API: GET /routines?sort=next_due&limit=8&status=active           → routineGoals
  API: GET /events?sort=date&limit=10                              → upcomingEvents
  API: GET /settings                                               → dev_mode toggle
*/

import { useState } from "react";
import Card from "../components/Card";
import TaskCard from "../components/TaskCard";
import AttentionCard from "../components/AttentionCard";
import RoutineCard from "../components/RoutineCard";
import EventCard from "../components/EventCard";
import DevWisdom from "../components/DevWisdom";
import CreateRoutineGoal from "../components/CreateRoutineGoal";
import CreateEvent from "../components/CreateEvent";
import Button from "../components/Button";
import "../styles/home.css";

const CATEGORIES = [
  "Personal Project",
  "Client Project",
  "Learning",
  "Career",
  "Open Source",
  "Networking",
];

function Home() {
  const [routines, setRoutines] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [needsAttention] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [wisdom] = useState({
    quote: "Small commits lead to big projects.",
  });

  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showCreateRoutine, setShowCreateRoutine] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const handleRoutineComplete = (id) => {
    /* API: PATCH /routines/:id/complete */
    setRoutines((prev) => prev.filter((r) => r.id !== id));
  };

  const handleCreateGoal = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    /* API: POST /goals */
    const goal = {
      id: `goal-${Date.now()}`,
      title: fd.get("title"),
      category: fd.get("category"),
      categoryLabel: fd.get("category"),
      progress: { completed: 0, total: 1 },
      priority: fd.get("priority"),
      deadline: new Date(fd.get("deadline")).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      status: "not_started",
    };
    setTodayTasks((prev) => [...prev, goal]);
    setShowCreateGoal(false);
  };

  const handleCreateRoutine = (formData) => {
    /* API: POST /routines */
    const routine = {
      id: `routine-${Date.now()}`,
      title: formData.title,
      category: formData.category,
      repeat: formData.repeat,
      nextDue: new Date(formData.startDate).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      streak: 0,
    };
    setRoutines((prev) => [...prev, routine]);
    setShowCreateRoutine(false);
  };

  const handleCreateEvent = (formData) => {
    /* API: POST /events */
    const event = {
      id: `event-${Date.now()}`,
      name: formData.name,
      date: new Date(formData.date).toLocaleDateString("en-GB", {
        day: "numeric", month: "short", year: "numeric",
      }),
      daysLeft: Math.ceil(
        (new Date(formData.date) - new Date()) / (1000 * 60 * 60 * 24)
      ),
      location: formData.location || undefined,
    };
    setUpcomingEvents((prev) => [...prev, event]);
    setShowCreateEvent(false);
  };

  const isEmpty = todayTasks.length === 0;

  if (showCreateGoal) {
    return (
      <div className="Home">
        <Card className="Home-create-card">
          <h2 className="Home-create-title">Create Goal</h2>
          <form onSubmit={handleCreateGoal} className="Home-create-form">
            <div className="Home-create-field">
              <label>Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Finish Sidebar Layout"
                required
              />
            </div>

            <div className="Home-create-field">
              <label>Category</label>
              <select name="category" required>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="Home-create-field">
              <label>Priority</label>
              <select name="priority" defaultValue="medium">
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div className="Home-create-field">
              <label>Deadline</label>
              <input type="date" name="deadline" required />
            </div>

            <div className="Home-create-actions">
              <Button type="submit">Create Goal</Button>
              <Button type="button" variant="ghost" onClick={() => setShowCreateGoal(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  if (showCreateRoutine) {
    return (
      <div className="Home">
        <CreateRoutineGoal
          defaultCategory="Personal"
          onSubmit={handleCreateRoutine}
          onCancel={() => setShowCreateRoutine(false)}
        />
      </div>
    );
  }

  if (showCreateEvent) {
    return (
      <div className="Home">
        <CreateEvent
          onSubmit={handleCreateEvent}
          onCancel={() => setShowCreateEvent(false)}
        />
      </div>
    );
  }

  return (
    <div className="Home">
      <div className="Home-greeting">
        <h1>👋 Welcome back, Lawrence</h1>
        <p>Here&apos;s what needs your attention today.</p>
      </div>

      {isEmpty ? (
        <div className="Home-empty">
          <p>Nothing to work on yet.</p>
          <p>Create your first goal to get started.</p>
          <Button onClick={() => setShowCreateGoal(true)}>+ Create Goal</Button>
        </div>
      ) : (
        <>
          <section className="Home-section">
            <div className="SectionHeader">
              <h2 className="SectionHeader-title">
                <span className="SectionHeader-icon">📋</span> Today&apos;s Tasks
              </h2>
              <button className="SectionHeader-action">View All</button>
            </div>
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </section>

          {needsAttention.length > 0 && (
            <section className="Home-section">
              <div className="SectionHeader">
                <h2 className="SectionHeader-title">
                  <span className="SectionHeader-icon">⚠️</span> Needs Attention
                </h2>
              </div>
              {needsAttention.map((item) => (
                <AttentionCard key={item.id} item={item} />
              ))}
            </section>
          )}

          {routines.length > 0 && (
            <section className="Home-section">
              <div className="SectionHeader">
                <h2 className="SectionHeader-title">
                  <span className="SectionHeader-icon">🔄</span> Routine Goals
                </h2>
                <button
                  className="SectionHeader-action"
                  onClick={() => setShowCreateRoutine(true)}
                >
                  + New Routine
                </button>
              </div>
              {routines.map((routine) => (
                <RoutineCard
                  key={routine.id}
                  routine={routine}
                  onComplete={handleRoutineComplete}
                />
              ))}
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section className="Home-section">
              <div className="SectionHeader">
                <h2 className="SectionHeader-title">
                  <span className="SectionHeader-icon">📅</span> Upcoming Events
                </h2>
                <button
                  className="SectionHeader-action"
                  onClick={() => setShowCreateEvent(true)}
                >
                  + Add Event
                </button>
              </div>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          )}

          <section className="Home-section">
            <DevWisdom quote={wisdom.quote} />
          </section>
        </>
      )}
    </div>
  );
}

export default Home;
