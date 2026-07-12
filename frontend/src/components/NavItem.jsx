import { NavLink } from "react-router-dom";

function NavItem({ label, path }) {
  return (
    <li>
      <NavLink to={path} className={({ isActive }) => isActive ? "active" : ""}>
        {label}
      </NavLink>
    </li>
  );
}

export default NavItem;
