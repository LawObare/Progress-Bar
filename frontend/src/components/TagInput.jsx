import { useState } from "react";
import Tag from "./Tag";

function TagInput({ tags = [], onChange }) {
  const [input, setInput] = useState("");

  const addTag = (value) => {
    const trimmed = value.trim().replace(/,$/, "");
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (label) => {
    onChange(tags.filter((t) => t !== label));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(input);
    }
    if (e.key === "Backspace" && !input && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleBlur = () => {
    if (input) addTag(input);
  };

  return (
    <div className="TagInput">
      {tags.map((tag) => (
        <Tag key={tag} label={tag} onRemove={removeTag} />
      ))}
      <input
        className="TagInput-field"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder="Add tag..."
      />
    </div>
  );
}

export default TagInput;
