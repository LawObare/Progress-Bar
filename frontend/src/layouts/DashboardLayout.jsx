import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

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
