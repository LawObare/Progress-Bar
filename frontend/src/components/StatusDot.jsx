/*
  API: statusIndicator maps to:
    green  → on track
    yellow → at risk
    gray   → not started
  Used on project/career cards.
*/
function StatusDot({ color }) {
  return <span className={`StatusDot StatusDot--${color}`} />;
}

export default StatusDot;
