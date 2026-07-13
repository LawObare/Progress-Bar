import { useState } from "react";
import "../styles/quick-create.css";

function QuickCreate({ onCreate, placeholder = "Quick add..." }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) {
      onCreate(value.trim());
      setValue("");
      setOpen(false);
    }
  };

  if (!open) {
    return (
      <button className="QuickCreate-fab" onClick={() => setOpen(true)} type="button">
        +
      </button>
    );
  }

  return (
    <div className="QuickCreate">
      <form onSubmit={handleSubmit} className="QuickCreate-form">
        <input
          className="QuickCreate-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          autoFocus
        />
        <button className="QuickCreate-submit" type="submit" disabled={!value.trim()}>
          Add
        </button>
        <button className="QuickCreate-cancel" type="button" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default QuickCreate;
