import navigation from "../data/navigation";
import NavItem from "./NavItem";

function Sidebar() {
    return (
        <aside>
            <ul>
                {navigation.map((item) => (
                    <NavItem 
                    key={item.path} 
                    label={item.label} 
                    path={item.path} 
                    />
                ))}
            </ul>
        </aside>
    );
}

export default Sidebar;
