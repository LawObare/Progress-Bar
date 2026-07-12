/*
  ─── Create Event (shared: Home & Networking) ───

  API: POST /events
  Request body:
  {
    name: string,
    date: string,         // ISO date
    location?: string,
    notes?: string,
  }
  Response: Event
  {
    id, name, date, daysLeft, location?
  }
*/
import { useState } from "react";
import Card from "./Card";
import Button from "./Button";

function CreateEvent({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    name: "",
    date: "",
    location: "",
    notes: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    /* API: POST /events */
    onSubmit?.(form);
  };

  return (
    <div className="CreateEvent">
      <Card className="CreateEvent-card">
        <h2 className="CreateEvent-title">Create Event</h2>

        <form onSubmit={handleSubmit} className="CreateEvent-form">
          <div className="CreateEvent-field">
            <label>Event Name</label>
            <input
              type="text"
              value={form.name}
              onChange={handleChange("name")}
              placeholder="e.g. Zone01 Hackathon"
              required
            />
          </div>

          <div className="CreateEvent-field">
            <label>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              required
            />
          </div>

          <div className="CreateEvent-field">
            <label>
              Location <span className="CreateEvent-opt">(Optional)</span>
            </label>
            <input
              type="text"
              value={form.location}
              onChange={handleChange("location")}
              placeholder="e.g. Nairobi, Kenya"
            />
          </div>

          <div className="CreateEvent-field">
            <label>
              Notes <span className="CreateEvent-opt">(Optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={handleChange("notes")}
              placeholder="Any additional details..."
              rows={3}
            />
          </div>

          <div className="CreateEvent-actions">
            <Button type="submit">Create Event</Button>
            <Button type="button" variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

export default CreateEvent;
