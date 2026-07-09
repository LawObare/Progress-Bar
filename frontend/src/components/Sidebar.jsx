import navigation from "../data/navigation";
import NavItem from "./NavItem";

function Sidebar() {
    return (
        <aside>
            <nav>
                 <div className="Sidebar-logo">
                    <h1>Progress Bar</h1>
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
