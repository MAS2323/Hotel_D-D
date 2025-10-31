import React from "react";

const AdminTopBar = ({ user, onLogout, onToggle }) => (
  <header className="admin-topbar">
    <div className="topbar-left">
      <button className="mobile-toggle" onClick={onToggle}>
        ☰
      </button>
      <span className="app-name">Hotel D&D</span>
    </div>
    <div className="topbar-center">
      <h1 className="page-title">Dashboard</h1>
    </div>
    <div className="topbar-right">
      <span className="user-greeting">Hola, {user?.username || "Admin"}</span>
      <button onClick={onLogout} className="topbar-logout">
        Logout
      </button>
    </div>
  </header>
);

export default AdminTopBar;
