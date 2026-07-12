import "../styles/header.css";

function Header({ onToggleSidebar }) {
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

      <div className="Header-actions">
        <button className="Header-avatar" title="Profile">
          <span className="Header-avatar-inner">U</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
