import {Outlet} from "react-router-dom";

function DashboardLayout() {
    return (
        <>
            <Sidebar />

            <Header/>

            <main>
                <Outlet />
            </main>
        </>
    );
}

export default DashboardLayout;
