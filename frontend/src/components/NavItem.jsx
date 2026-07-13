import { NavLink } from "react-router-dom";

function NavItem({ label, path, icon }) {
  return (
    <li>
      <NavLink to={path} className={({ isActive }) => isActive ? "active" : ""}>
        <span className="NavItem-icon">{icon}</span>
        <span className="NavItem-label">{label}</span>
      </NavLink>
    </li>
  );
}

export default NavItem;
