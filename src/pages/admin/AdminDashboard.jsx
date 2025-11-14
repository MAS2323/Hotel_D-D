import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import "./AdminDashboard.css";

import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import DashboardHome from "./DashboardHome";
import UserManagement from "./UserManagement";
import ServicesManagement from "./ServicesManagement";
import RoomsManagement from "./RoomsManagement";
import BookingsManagement from "./BookingsManagement";
import GalleryManagement from "./GalleryManagement";
import ApartmentAdmin from "./ApartmentAdmin";

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/admin/login");
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [window.location.pathname]);

  return (
    <div className="admin-wrapper">
      <AdminSidebar
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
      />
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={toggleSidebar} />
      )}
      <div className={`admin-main ${sidebarOpen ? "sidebar-open" : ""}`}>
        <AdminTopBar
          user={user}
          onLogout={handleLogout}
          onToggle={toggleSidebar}
        />
        <main className="admin-content">
          <Routes>
            <Route path="/" element={<DashboardHome />} />
            <Route path="/users" element={<UserManagement />} />
            <Route path="/services" element={<ServicesManagement />} />
            <Route path="/rooms" element={<RoomsManagement />} />
            <Route path="/departments" element={<ApartmentAdmin />} />
            <Route path="/bookings" element={<BookingsManagement />} />
            <Route path="/gallery" element={<GalleryManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
