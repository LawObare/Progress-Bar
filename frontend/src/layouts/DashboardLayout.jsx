import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/layout.css";

function DashboardLayout() {
    return (
        <>

            <Header/>

            <div className="Dashboard-container">
                <Sidebar />

                 <main className="Dashboard-content">
                     <Outlet />
                 </main>
            </div>
        </>
    );
}

export default DashboardLayout;
