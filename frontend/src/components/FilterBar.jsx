import "../styles/filter-bar.css";

const SORT_OPTIONS = [
  { key: "newest", label: "Newest" },
  { key: "oldest", label: "Oldest" },
  { key: "deadline", label: "Deadline" },
  { key: "priority", label: "Priority" },
  { key: "alpha", label: "Alphabetical" },
];

const STATUS_OPTIONS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
];

function FilterBar({
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
  tags = [],
  activeTag,
  onTagChange,
}) {
  return (
    <div className="FilterBar">
      <div className="FilterBar-group">
        <label className="FilterBar-label">Status</label>
        <div className="FilterBar-chips">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`FilterBar-chip ${statusFilter === opt.key ? "FilterBar-chip--active" : ""}`}
              onClick={() => onStatusChange(opt.key)}
              type="button"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {tags.length > 0 && (
        <div className="FilterBar-group">
          <label className="FilterBar-label">Tag</label>
          <div className="FilterBar-chips">
            <button
              className={`FilterBar-chip ${!activeTag ? "FilterBar-chip--active" : ""}`}
              onClick={() => onTagChange(null)}
              type="button"
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                className={`FilterBar-chip ${activeTag === tag ? "FilterBar-chip--active" : ""}`}
                onClick={() => onTagChange(tag)}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="FilterBar-group">
        <label className="FilterBar-label">Sort</label>
        <select
          className="FilterBar-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.key} value={opt.key}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
