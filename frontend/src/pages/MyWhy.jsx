/*
  ─── My Why Page ───

  API: GET /my-why
  Response:
  {
    vision: string,
    purpose: string,
    letterToFutureSelf: string,
    quitMessage: string,
    mantra: string,
  }

  API: PUT /my-why
  Body: same shape as above
*/

import { useState } from "react";
import Card from "../components/Card";
import Button from "../components/Button";
import "../styles/mywhy.css";

function MyWhy() {
  const [content, setContent] = useState({
    vision: "",
    purpose: "",
    letterToFutureSelf: "",
    quitMessage: "",
    mantra: "",
  });

  const [editing, setEditing] = useState(true);

  const handleChange = (field) => (e) => {
    setContent((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = () => {
    /* API: PUT /my-why { ...content } */
    setEditing(false);
  };

  const handleEdit = () => {
    setEditing(true);
  };

  return (
    <div className="MyWhy">
      <div className="SectionHeader">
        <h2 className="SectionHeader-title">My Why</h2>
        {editing ? (
          <Button size="sm" onClick={handleSave}>Save Changes</Button>
        ) : (
          <Button size="sm" variant="secondary" onClick={handleEdit}>Edit</Button>
        )}
      </div>

      <Card className="MyWhy-card">
        <blockquote className="MyWhy-quote">
          &ldquo;Remember why you started.&rdquo;
        </blockquote>

        <section className="MyWhy-section">
          <h3>Who do you want to become as a developer?</h3>
          {editing ? (
            <textarea
              value={content.vision}
              onChange={handleChange("vision")}
              placeholder="Describe the developer you're working to become..."
              rows={4}
            />
          ) : (
            <p className="MyWhy-text">{content.vision || "—"}</p>
          )}
        </section>

        <div className="MyWhy-divider" />

        <section className="MyWhy-section">
          <h3>What are you building towards?</h3>
          {editing ? (
            <textarea
              value={content.purpose}
              onChange={handleChange("purpose")}
              placeholder="What's the big goal you're working towards?"
              rows={4}
            />
          ) : (
            <p className="MyWhy-text">{content.purpose || "—"}</p>
          )}
        </section>

        <div className="MyWhy-divider" />

        <section className="MyWhy-section">
          <h3>Letter to Your Future Self</h3>
          {editing ? (
            <textarea
              value={content.letterToFutureSelf}
              onChange={handleChange("letterToFutureSelf")}
              placeholder="Write a letter to your future self..."
              rows={6}
            />
          ) : (
            <p className="MyWhy-text">{content.letterToFutureSelf || "—"}</p>
          )}
        </section>

        <div className="MyWhy-divider" />

        <section className="MyWhy-section">
          <h3>Read this when you want to quit</h3>
          {editing ? (
            <textarea
              value={content.quitMessage}
              onChange={handleChange("quitMessage")}
              placeholder="Write something to remind yourself why you started..."
              rows={6}
            />
          ) : (
            <p className="MyWhy-text">{content.quitMessage || "—"}</p>
          )}
        </section>

        <div className="MyWhy-divider" />

        <section className="MyWhy-section">
          <h3>Your Mantra</h3>
          {editing ? (
            <input
              type="text"
              value={content.mantra}
              onChange={handleChange("mantra")}
              placeholder="A short phrase that keeps you going..."
              className="MyWhy-mantra-input"
            />
          ) : (
            <p className="MyWhy-text MyWhy-mantra-text">{content.mantra || "—"}</p>
          )}
        </section>

        {editing && (
          <>
            <div className="MyWhy-divider" />
            <div className="MyWhy-save-row">
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );
}

export default MyWhy;
