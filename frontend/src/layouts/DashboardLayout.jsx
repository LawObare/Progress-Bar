import {Outlet} from "react-router-dom";

function DashboardLayout() {
    return (
        <>
            <aside>
                <h2>Sidebar</h2>
            </aside>

            <header>
                <h2>Header</h2>
            </header>

            <main>
                <Outlet />
            </main>
        </>
    );
}

export default DashboardLayout;
