import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
import SearchBar from "./SearchBar";
import "../styles/header.css";

function Header({ onToggleSidebar }) {
  const { setQuery } = useSearch();
  const { user, logout } = useAuth();
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

  const initial = user?.name?.charAt(0) || "?";
  const displayName = user?.name || "Guest";

  return (
    <header className="Header">
      <div className="Header-left">
        <button className="Header-menu-btn" onClick={onToggleSidebar}>
          ☰
        </button>
        <div className="Header-brand">
          <span className="Header-logo">◉</span>
          <div className="Header-brand-text">
            <span className="Header-title">Progress Bar</span>
            <span className="Header-tagline">developer operating system</span>
          </div>
        </div>
      </div>

      <div className="Header-center">
        <SearchBar onSearch={setQuery} placeholder="Search..." />
      </div>

      <div className="Header-actions" ref={menuRef}>
        <button
          className="Header-profile-btn"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span className="Header-avatar">
            <span className="Header-avatar-inner">{initial}</span>
          </span>
          <span className="Header-name">{displayName}</span>
          <span className="Header-chevron">▼</span>
        </button>

        {menuOpen && (
          <div className="Header-dropdown">
            {user && (
              <>
                <Link to="/profile" className="Header-dropdown-item" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
                <Link to="/settings" className="Header-dropdown-item" onClick={() => setMenuOpen(false)}>
                  Settings
                </Link>
                <div className="Header-dropdown-divider" />
              </>
            )}
            <Link
              to={user ? "/home" : "/login"}
              className="Header-dropdown-item"
              onClick={() => {
                if (user) logout();
                setMenuOpen(false);
              }}
            >
              {user ? "Sign Out" : "Sign In"}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
