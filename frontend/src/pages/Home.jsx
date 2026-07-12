/*
  API: GET /goals?status=active&sort=priority,deadline&limit=10    → todayTasks
  API: GET /goals?status=overdue,urgent&sort=deadline              → needsAttention
  API: GET /routines?sort=next_due&limit=8&status=active           → routineGoals
  API: GET /events?sort=date&limit=10                              → upcomingEvents
  API: GET /settings                                               → dev_mode toggle
*/

import { useState } from "react";
import TaskCard from "../components/TaskCard";
import AttentionCard from "../components/AttentionCard";
import RoutineCard from "../components/RoutineCard";
import EventCard from "../components/EventCard";
import Card from "../components/Card";
import "../styles/home.css";

function Home() {
  const [todayTasks] = useState([]);
  const [needsAttention] = useState([]);
  const [routines] = useState([]);
  const [upcomingEvents] = useState([]);

  const isEmpty = todayTasks.length === 0;

  return (
    <div className="Home">
      <div className="Home-greeting">
        <h1>👋 Welcome back, Lawrence</h1>
        <p>Here&apos;s what needs your attention today.</p>
      </div>

      {isEmpty ? (
        <Card className="Home-empty-card">
          <p className="Home-empty-line">Nothing to see here...</p>
          <p className="Home-empty-sub">Time to build something.</p>
        </Card>
      ) : (
        <>
          <section className="Home-section">
            <h2 className="SectionHeader-title">
              <span className="SectionHeader-icon">📋</span> Today&apos;s Tasks
            </h2>
            {todayTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </section>

          {needsAttention.length > 0 && (
            <section className="Home-section">
              <h2 className="SectionHeader-title">
                <span className="SectionHeader-icon">⚠️</span> Needs Attention
              </h2>
              {needsAttention.map((item) => (
                <AttentionCard key={item.id} item={item} />
              ))}
            </section>
          )}

          {routines.length > 0 && (
            <section className="Home-section">
              <h2 className="SectionHeader-title">
                <span className="SectionHeader-icon">🔄</span> Routine Goals
              </h2>
              {routines.map((routine) => (
                <RoutineCard key={routine.id} routine={routine} />
              ))}
            </section>
          )}

          {upcomingEvents.length > 0 && (
            <section className="Home-section">
              <h2 className="SectionHeader-title">
                <span className="SectionHeader-icon">📅</span> Upcoming Events
              </h2>
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          )}
        </>
      )}

      <section className="Home-section Home-wisdom">
        💡 Life is like Git... you have to commit before you can push.
      </section>
    </div>
  );
}

export default Home;
