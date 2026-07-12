import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/header.css";

function Header({ onToggleSidebar }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="Header">
      <div className="Header-left">
        <button className="Header-menu-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <div className="Header-brand">
          <span className="Header-logo">◉</span>
          <span className="Header-title">Progress Bar</span>
        </div>
      </div>

      <div className="Header-actions" ref={menuRef}>
        <button
          className="Header-profile-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="Header-avatar">
            <span className="Header-avatar-inner">L</span>
          </span>
          <span className="Header-name">Lawrence</span>
          <span className="Header-chevron">▼</span>
        </button>

        {menuOpen && (
          <div className="Header-dropdown">
            <Link to="/profile" className="Header-dropdown-item" onClick={() => setMenuOpen(false)}>
              Profile
            </Link>
            <Link to="/settings" className="Header-dropdown-item" onClick={() => setMenuOpen(false)}>
              Settings
            </Link>
            <div className="Header-dropdown-divider" />
            <Link to="/login" className="Header-dropdown-item" onClick={() => setMenuOpen(false)}>
              Logout
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
