import {Outlet} from "react-router-dom";

function DashboardLayout() {
    return (
        <div>
            <aside>
                Sidebar
            </aside>

            <header>
                Header
            </header>

            <main>
                <Outlet />
            </main>
        </div>
    );
}

export default DashboardLayout;
