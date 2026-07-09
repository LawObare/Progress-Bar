import navigation from "../data/navigation";
import NavItem from "./NavItem";
import "../styles/sidebar.css";

function Sidebar() {
    return (
        <aside className="Sidebar">
            <nav className="Sidebar-nav">
                 <div className="Sidebar-logo">
                    <h2>Progress Bar</h2>
                 </div>
            
                 <ul>
                      {navigation.map((item) => (
                         <NavItem 
                         key={item.path} 
                         {...item}
                         />
                   ))}
                 </ul>
            </nav>
        </aside>
    );
}

export default Sidebar;
