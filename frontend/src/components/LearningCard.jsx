/*
  ─── Self Learning — List Card ───

  API: GET /learning
  Response shape:
  {
    id: string,
    title: string,
    progress: { completed: number, total: number },
    progressUnit: string,        // "Lessons" | "Chapters" | "Modules" | etc.
    source: { type: string, name?: string },  // { type: "Book", name: "Let's Go" }
    statusDot: "green" | "yellow" | "gray",
    targetDate: string,
  }

  Clicking the card expands it into LearningDetail.
*/
import Card from "./Card";
import ProgressBar from "./ProgressBar";
import StatusDot from "./StatusDot";

function LearningCard({ goal, onSelect }) {
  const sourceLabel = goal.source.name
    ? `${goal.source.type} • ${goal.source.name}`
    : goal.source.type;

  return (
    <Card
      className="LearningCard"
      onClick={() => onSelect?.(goal.id)}
    >
      <div className="LearningCard-body">
        <div className="LearningCard-main">
          <div className="LearningCard-header">
            <StatusDot color={goal.statusDot} />
            <span className="LearningCard-title">{goal.title}</span>
          </div>
          <span className="LearningCard-source">{sourceLabel}</span>
        </div>

        <div className="LearningCard-right">
          <ProgressBar
            completed={goal.progress.completed}
            total={goal.progress.total}
          />
          <span className="LearningCard-target">{goal.targetDate}</span>
        </div>
      </div>

      <span className="LearningCard-chevron">▶</span>
    </Card>
  );
}

export default LearningCard;
