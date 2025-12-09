// src/components/admin/DashboardHome.js
import React, { useState, useEffect } from "react";
import { statsAPI } from "../../services/api";
import { useNavigate } from "react-router-dom";

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
    apartments: 0,
    bookings: 0,
    services: 0,
    menu: 0,
    gallery: 0, // ← NUEVO: contador de imágenes en galería
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const [
          usersRes,
          roomsRes,
          apartmentsRes,
          bookingsRes,
          servicesRes,
          menuRes,
          galleryRes, // ← NUEVO: fetch count de imágenes
        ] = await Promise.all([
          statsAPI.getUsers(),
          statsAPI.getRooms(),
          statsAPI.getApartments(),
          statsAPI.getBookings(),
          statsAPI.getServices(),
          statsAPI.getMenuItems(),
          statsAPI.getGallery(), // ← NUEVO: asumiendo endpoint que retorna {total: number}
        ]);
        // Ajusta a 'total' en lugar de 'count', basado en el error (objeto con key {total})
        setStats({
          users: Number(usersRes.total) || 0,
          rooms: Number(roomsRes.total) || 0,
          apartments: Number(apartmentsRes.total) || 0,
          bookings: Number(bookingsRes.total) || 0,
          services: Number(servicesRes.total) || 0,
          menu: Number(menuRes.total) || 0,
          gallery: Number(galleryRes.total) || 0, // ← NUEVO
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
        setError(err.message);
        if (err.message.includes("401")) {
          alert("Sesión expirada o no autorizado. Redirigiendo al login...");
          localStorage.removeItem("token");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [navigate]);

  const handleMoreInfo = (type) => {
    const routeMap = {
      Usuarios: "/admin/users",
      Habitaciones: "/admin/rooms",
      Apartamentos: "/admin/departments",
      Reservas: "/admin/bookings",
      Servicios: "/admin/services",
      Menú: "/admin/menu",
      Galería: "/admin/gallery", // ← NUEVO
    };
    navigate(routeMap[type]);
  };

  if (loading)
    return <div className="loading-spinner">Cargando estadísticas...</div>;

  if (error) return <div className="error-message">Error: {error}</div>;

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
          icon="🏠"
          number={stats.apartments}
          label="Apartamentos"
          color="purple"
          onMoreInfo={() => handleMoreInfo("Apartamentos")}
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
        <StatCard
          icon="🍽️"
          number={stats.menu}
          label="Menú"
          color="orange"
          onMoreInfo={() => handleMoreInfo("Menú")}
        />
        <StatCard
          icon="🖼️"
          number={stats.gallery}
          label="Galería"
          color="pink" // ← NUEVO: color para galería (ajusta si tienes CSS para 'pink')
          onMoreInfo={() => handleMoreInfo("Galería")}
        />
      </div>
    </div>
  );
};

export default DashboardHome;
