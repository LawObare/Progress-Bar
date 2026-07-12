/*
  ─── Settings Page ───

  API: GET /settings
  Response:
  {
    theme: "light" | "dark" | "system",
    dashboardToggles: {
      showTodayTasks: boolean,
      showNeedsAttention: boolean,
      showRoutineGoals: boolean,
      showUpcomingEvents: boolean,
    },
    devMode: { jokesEnabled: boolean },
    weekStartsOn: "monday" | "sunday",
  }

  API: PUT /settings
  Body: same shape as above
*/

import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import "../styles/settings.css";

function Settings() {
  const [settings, setSettings] = useState({
    theme: "dark",
    dashboardToggles: {
      showTodayTasks: true,
      showNeedsAttention: true,
      showRoutineGoals: true,
      showUpcomingEvents: true,
    },
    devMode: { jokesEnabled: false },
    weekStartsOn: "monday",
  });

  const handleToggle = (section, field) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field],
      },
    }));
  };

  const handleRadio = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    /* API: PUT /settings { ...settings } */
  };

  const handleReset = () => {
    /* API: POST /settings/reset */
  };

  return (
    <div className="Settings">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">Settings</h2>
        <Button size="sm" onClick={handleSave}>Save Settings</Button>
      </div>

      <Card className="Settings-card">
        {/* ─── Appearance ─── */}
        <section className="Settings-section">
          <h3>Appearance</h3>
          <div className="Settings-subsection">
            <span className="Settings-label">Theme</span>
            <div className="Settings-radios">
              {["Light", "Dark", "System"].map((opt) => (
                <label key={opt} className="Settings-radio">
                  <input
                    type="radio"
                    name="theme"
                    checked={settings.theme === opt.toLowerCase()}
                    onChange={() => handleRadio("theme", opt.toLowerCase())}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="Settings-divider" />

        {/* ─── Home Dashboard ─── */}
        <section className="Settings-section">
          <h3>Home Dashboard</h3>
          <div className="Settings-checkboxes">
            {[
              { key: "showTodayTasks", label: "Show Today's Tasks" },
              { key: "showNeedsAttention", label: "Show Needs Attention" },
              { key: "showRoutineGoals", label: "Show Routine Goals" },
              { key: "showUpcomingEvents", label: "Show Upcoming Events" },
            ].map((item) => (
              <label key={item.key} className="Settings-checkbox">
                <input
                  type="checkbox"
                  checked={settings.dashboardToggles[item.key]}
                  onChange={() => handleToggle("dashboardToggles", item.key)}
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>

        <div className="Settings-divider" />

        {/* ─── Developer Mode ─── */}
        <section className="Settings-section">
          <h3>Developer Mode</h3>
          <label className="Settings-checkbox">
            <input
              type="checkbox"
              checked={settings.devMode.jokesEnabled}
              onChange={() => handleToggle("devMode", "jokesEnabled")}
            />
            Show Developer Jokes
          </label>
          <p className="Settings-hint">
            Example: &ldquo;Life is like Git. You have to commit before you can push.&rdquo;
          </p>
        </section>

        <div className="Settings-divider" />

        {/* ─── General ─── */}
        <section className="Settings-section">
          <h3>General</h3>
          <div className="Settings-subsection">
            <span className="Settings-label">Week Starts On</span>
            <div className="Settings-radios">
              {["Monday", "Sunday"].map((opt) => (
                <label key={opt} className="Settings-radio">
                  <input
                    type="radio"
                    name="weekStart"
                    checked={settings.weekStartsOn === opt.toLowerCase()}
                    onChange={() => handleRadio("weekStartsOn", opt.toLowerCase())}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        </section>

        <div className="Settings-divider" />

        {/* ─── Danger Zone ─── */}
        <section className="Settings-section">
          <h3 className="Settings-danger-title">Danger Zone</h3>
          <p className="Settings-danger-desc">
            This will reset all your data. This action cannot be undone.
          </p>
          <Button variant="danger" size="sm" onClick={handleReset}>
            Reset Application
          </Button>
        </section>

        <div className="Settings-divider" />

        {/* ─── About ─── */}
        <section className="Settings-section">
          <h3>About</h3>
          <p className="Settings-about-name">Progress Bar</p>
          <p className="Settings-about-version">Version 1.0.0</p>
        </section>
      </Card>
    </div>
  );
}

export default Settings;
