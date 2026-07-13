import "../styles/view-toggle.css";

const VIEWS = [
  { key: "cards", label: "Cards" },
  { key: "list", label: "List" },
  { key: "table", label: "Table" },
];

function ViewToggle({ active, onChange }) {
  return (
    <div className="ViewToggle">
      {VIEWS.map((v) => (
        <button
          key={v.key}
          className={`ViewToggle-btn ${active === v.key ? "ViewToggle-btn--active" : ""}`}
          onClick={() => onChange(v.key)}
          type="button"
        >
          {v.label}
        </button>
      ))}
    </div>
  );
}

export default ViewToggle;
