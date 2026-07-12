/*
  Data shape:
  {
    id, name, date, daysLeft, location
  }
  API: GET /events
*/
import Card from "./Card";

function EventCard({ event }) {
  return (
    <Card className="EventCard">
      <div className="EventCard-left">
        <span className="EventCard-name">{event.name}</span>
        <span className="EventCard-date">
          {event.date}{event.location ? ` · ${event.location}` : ""}
        </span>
      </div>
      <span className="EventCard-days">{event.daysLeft} days left</span>
    </Card>
  );
}

export default EventCard;
