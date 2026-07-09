import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import 

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
