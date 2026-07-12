/*
  API: Progress is { completed, total }
  Visual indicator: fraction + bar fill
*/
function ProgressBar({ completed, total }) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
  return (
    <div className="ProgressBar">
      <span className="ProgressBar-label">
        {completed} / {total}
      </span>
      <div className="ProgressBar-track">
        <div
          className="ProgressBar-fill"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
