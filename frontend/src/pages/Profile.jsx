/*
  ─── Profile Page ───

  API: GET /profile
  Response:
  {
    name: string,
    bio: string,
    avatar?: string,
    journey: {
      projectsCompleted: number,
      learningGoalsFinished: number,
      careerGoalsAchieved: number,
      openSourceContributions: number,
      routineGoalsCompleted: number,
      eventsAttended: number,
    },
  }

  API: PUT /profile
  Body: { name, bio }
*/

import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import "../styles/profile.css";

function Profile() {
  const [profile, setProfile] = useState({
    name: "Lawrence Obare",
    bio: "Passionate about building backend systems and creating software that solves real-world problems one project at a time.",
    journey: {
      projectsCompleted: 5,
      learningGoalsFinished: 12,
      careerGoalsAchieved: 4,
      openSourceContributions: 8,
      routineGoalsCompleted: 97,
      eventsAttended: 6,
    },
  });

  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState(profile.bio);

  const handleEdit = () => {
    setEditBio(profile.bio);
    setEditing(true);
  };

  const handleSave = () => {
    /* API: PUT /profile { name: profile.name, bio: editBio } */
    setProfile((prev) => ({ ...prev, bio: editBio }));
    setEditing(false);
  };

  return (
    <div className="Profile">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Profile</h2>
        {editing ? (
          <Button size="sm" onClick={handleSave}>Save</Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={handleEdit}>Edit</Button>
        )}
      </div>

      <Card className="Profile-card">
        {/* ─── Avatar ─── */}
        <div className="Profile-avatar-section">
          <div className="Profile-avatar">
            <span className="Profile-avatar-letter">
              {profile.name.charAt(0)}
            </span>
          </div>
          <h1 className="Profile-name">{profile.name}</h1>
        </div>

        <div className="Profile-divider" />

        {/* ─── Bio ─── */}
        <section className="Profile-section">
          <h3>Bio</h3>
          {editing ? (
            <textarea
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="Profile-bio-input"
              rows={4}
            />
          ) : (
            <p className="Profile-bio-text">{profile.bio}</p>
          )}
        </section>

        <div className="Profile-divider" />

        {/* ─── Journey Stats ─── */}
        <section className="Profile-section">
          <h3>Your Journey</h3>
          <div className="Profile-stats">
            {[
              { label: "Projects Completed", value: profile.journey.projectsCompleted },
              { label: "Learning Goals Finished", value: profile.journey.learningGoalsFinished },
              { label: "Career Goals Achieved", value: profile.journey.careerGoalsAchieved },
              { label: "Open Source Contributions", value: profile.journey.openSourceContributions },
              { label: "Routine Goals Completed", value: profile.journey.routineGoalsCompleted },
              { label: "Events Attended", value: profile.journey.eventsAttended },
            ].map((stat) => (
              <div key={stat.label} className="Profile-stat">
                <span className="Profile-stat-value">{stat.value}</span>
                <span className="Profile-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </section>

        <div className="Profile-divider" />

        {/* ─── Quote ─── */}
        <blockquote className="Profile-quote">
          &ldquo;Progress isn&apos;t measured by where you are.<br />
          It&apos;s measured by how far you&apos;ve come.&rdquo;
        </blockquote>
      </Card>
    </div>
  );
}

export default Profile;
