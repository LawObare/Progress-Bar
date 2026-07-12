/*
  Data shape:
  {
    id, title, category, categoryLabel,
    progress: { completed, total },
    priority, deadline, status
  }
  API: PATCH /goals/:id  { status: "completed" }
*/
import Card from "./Card";
import ProgressBar from "./ProgressBar";

function TaskCard({ task }) {
  return (
    <Card className="TaskCard">
      <div className="TaskCard-top">
        <span className="TaskCard-title">{task.title}</span>
        <span className={`TaskCard-priority TaskCard-priority--${task.priority}`}>
          {task.priority}
        </span>
      </div>
      <div className="TaskCard-meta">
        <span className="TaskCard-category">{task.categoryLabel}</span>
        <span className="TaskCard-deadline">Due {task.deadline}</span>
      </div>
      <ProgressBar completed={task.progress.completed} total={task.progress.total} />
    </Card>
  );
}

export default TaskCard;
