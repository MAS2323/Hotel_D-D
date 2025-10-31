// src/components/admin/DashboardHome.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const StatCard = ({ icon, number, label, color, onMoreInfo }) => (
  <div className={`stat-card ${color}`}>
    <div className="card-icon">{icon}</div>
    <div className="card-number">{number}</div>
    <div className="card-label">{label}</div>
    <button className="more-info-btn" onClick={onMoreInfo}>
      More info →
    </button>
  </div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState({
    users: 0,
    rooms: 0,
    bookings: 0,
    services: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersRes, roomsRes, bookingsRes, servicesRes] =
          await Promise.all([
            axios.get("/api/admin/stats/users"),
            axios.get("/api/admin/stats/rooms"),
            axios.get("/api/admin/stats/bookings"),
            axios.get("/api/admin/stats/services"),
          ]);
        setStats({
          users: usersRes.data.count,
          rooms: roomsRes.data.count,
          bookings: bookingsRes.data.count,
          services: servicesRes.data.count,
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleMoreInfo = (type) => {
    alert(`Más info sobre ${type}`); // Placeholder para navegación o modal
  };

  if (loading)
    return <div className="loading-spinner">Cargando estadísticas...</div>;

  return (
    <div className="dashboard-home">
      <h2 className="section-title">Resumen del Dashboard</h2>
      <div className="stats-grid">
        <StatCard
          icon="👥"
          number={stats.users}
          label="Usuarios"
          color="blue"
          onMoreInfo={() => handleMoreInfo("Usuarios")}
        />
        <StatCard
          icon="🛏️"
          number={stats.rooms}
          label="Habitaciones"
          color="green"
          onMoreInfo={() => handleMoreInfo("Habitaciones")}
        />
        <StatCard
          icon="📅"
          number={stats.bookings}
          label="Reservas"
          color="yellow"
          onMoreInfo={() => handleMoreInfo("Reservas")}
        />
        <StatCard
          icon="⚙️"
          number={stats.services}
          label="Servicios"
          color="red"
          onMoreInfo={() => handleMoreInfo("Servicios")}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
