import { useState, useRef, useEffect } from "react";
import "../styles/search.css";

function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "/" && !focused && !["INPUT", "TEXTAREA"].includes(e.target.tagName)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [focused]);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch?.(e.target.value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  return (
    <div className={`SearchBar ${focused ? "SearchBar--focused" : ""}`}>
      <span className="SearchBar-icon">/</span>
      <input
        ref={inputRef}
        className="SearchBar-input"
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
      />
      {query && (
        <button className="SearchBar-clear" onClick={handleClear} type="button">
          &times;
        </button>
      )}
    </div>
  );
}

export default SearchBar;
