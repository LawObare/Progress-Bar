import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/dashboard-layout.css";
import "../styles/main.css";

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <Header />

      <main className="Main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
