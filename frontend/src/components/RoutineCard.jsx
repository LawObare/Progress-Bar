/*
  Data shape:
  {
    id, title, category, repeat, nextDue, streak
  }
  API: PATCH /routines/:id/complete
  Response: { ...routine, nextDue: <calculated>, streak: +1 }
*/
import Card from "./Card";

function RoutineCard({ routine, onComplete }) {
  return (
    <Card className="RoutineCard">
      <label className="RoutineCard-check">
        <input
          type="checkbox"
          onChange={() => onComplete?.(routine.id)}
          className="RoutineCard-checkbox"
        />
        <div className="RoutineCard-body">
          <span className="RoutineCard-title">{routine.title}</span>
          <span className="RoutineCard-meta">
            {routine.repeat} · {routine.category}
          </span>
        </div>
      </label>
      <span className="RoutineCard-next">Next: {routine.nextDue}</span>
    </Card>
  );
}

export default RoutineCard;
