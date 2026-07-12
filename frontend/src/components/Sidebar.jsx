import navigation from "../data/navigation";
import NavItem from "./NavItem";
import "../styles/sidebar.css";

function Sidebar({ open }) {
  const mainItems = navigation.filter((item) => item.path !== "/settings");
  const settingsItem = navigation.find((item) => item.path === "/settings");

  return (
    <aside className={`Sidebar ${open ? "" : "closed"}`}>
      <nav className="Sidebar-nav">
        <ul>
          {mainItems.map((item) => (
            <NavItem key={item.path} {...item} />
          ))}
        </ul>

        <div className="Sidebar-divider" />

        {settingsItem && (
          <ul>
            <NavItem {...settingsItem} />
          </ul>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
