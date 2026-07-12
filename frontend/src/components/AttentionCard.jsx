/*
  Data shape:
  {
    id, title, categoryLabel,
    progress: { completed, total },
    priority, deadline, status, overdueBy
  }
  API: PATCH /goals/:id  { priority, status }
*/
import Card from "./Card";
import ProgressBar from "./ProgressBar";

function AttentionCard({ item }) {
  return (
    <Card className="AttentionCard">
      <div className="AttentionCard-header">
        <span className="AttentionCard-title">{item.title}</span>
        {item.overdueBy && (
          <span className="AttentionCard-overdue">
            Overdue by {item.overdueBy}
          </span>
        )}
      </div>
      <ProgressBar completed={item.progress.completed} total={item.progress.total} />
    </Card>
  );
}

export default AttentionCard;
