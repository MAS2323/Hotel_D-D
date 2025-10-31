import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = ({ onLogout, isOpen, onToggle }) => (
  <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
    <div className="sidebar-header">
      <button className="toggle-btn" onClick={onToggle}>
        ☰
      </button>
      <h2 className="sidebar-title">Admin Panel</h2>
    </div>
    <ul className="sidebar-menu">
      <li>
        <Link to="/admin" className="sidebar-link active">
          <span className="icon">📊</span> Dashboard
        </Link>
      </li>
      <li>
        <Link to="/admin/users" className="sidebar-link">
          <span className="icon">👥</span> Gestión de Usuarios
        </Link>
      </li>
      <li>
        <Link to="/admin/services" className="sidebar-link">
          <span className="icon">⚙️</span> Gestión de Servicios
        </Link>
      </li>
      <li>
        <Link to="/admin/rooms" className="sidebar-link">
          <span className="icon">🛏️</span> Gestión de Habitaciones
        </Link>
      </li>
      <li>
        <Link to="/admin/bookings" className="sidebar-link">
          <span className="icon">📅</span> Gestión de Reservas
        </Link>
      </li>
      <li>
        <Link to="/admin/gallery" className="sidebar-link">
          <span className="icon">🖼️</span> Gestión de Galería
        </Link>
      </li>
    </ul>
    <div className="sidebar-footer">
      <button onClick={onLogout} className="logout-btn">
        <span className="icon">🚪</span> Logout
      </button>
    </div>
  </div>
);

export default AdminSidebar;
