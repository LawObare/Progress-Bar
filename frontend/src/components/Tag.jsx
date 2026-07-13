import "../styles/tags.css";

function Tag({ label, onRemove }) {
  return (
    <span className="Tag">
      {label}
      {onRemove && (
        <button className="Tag-remove" onClick={() => onRemove(label)} type="button">
          &times;
        </button>
      )}
    </span>
  );
}

export default Tag;
