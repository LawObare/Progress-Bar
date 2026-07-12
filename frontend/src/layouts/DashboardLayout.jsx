import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import "../styles/dashboard-layout.css";
import "../styles/main.css";

function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`dashboard-layout ${sidebarOpen ? "" : "sidebar-collapsed"}`}>
      <Header onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar open={sidebarOpen} />
      <main className="Main">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
