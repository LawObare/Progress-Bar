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
import { useAuth } from "../context/AuthContext";
import Card from "../components/Card";
import Button from "../components/Button";
import "../styles/profile.css";

const STAT_LABELS = [
  "Projects Completed",
  "Learning Goals Finished",
  "Career Goals Achieved",
  "Open Source Contributions",
  "Routine Goals Completed",
  "Events Attended",
];

function Profile() {
  const { user } = useAuth();
  const [bio, setBio] = useState("");
  const [editing, setEditing] = useState(false);
  const [editBio, setEditBio] = useState("");
  const statsInitial = STAT_LABELS.map(() => 0);

  const handleEdit = () => {
    setEditBio(bio);
    setEditing(true);
  };

  const handleSave = () => {
    /* API: PUT /profile { name: user.name, bio: editBio } */
    setBio(editBio);
    setEditing(false);
  };

  const displayName = user?.name || "Developer";

  return (
    <div className="Profile">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Profile</h2>
        {user && (editing ? (
          <Button size="sm" onClick={handleSave}>Save</Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={handleEdit}>Edit</Button>
        ))}
      </div>

      <Card className="Profile-card">
        {/* ─── Avatar ─── */}
        <div className="Profile-avatar-section">
          <div className="Profile-avatar">
            <span className="Profile-avatar-letter">
              {displayName.charAt(0)}
            </span>
          </div>
          <h1 className="Profile-name">{displayName}</h1>
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
              placeholder="Tell the world about yourself..."
            />
          ) : (
            <p className="Profile-bio-text">{bio || "—"}</p>
          )}
        </section>

        <div className="Profile-divider" />

        {/* ─── Journey Stats ─── */}
        <section className="Profile-section">
          <h3>Your Journey</h3>
          <div className="Profile-stats">
            {STAT_LABELS.map((label, i) => (
              <div key={label} className="Profile-stat">
                <span className="Profile-stat-value">{statsInitial[i]}</span>
                <span className="Profile-stat-label">{label}</span>
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
