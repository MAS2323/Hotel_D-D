import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Para nested routes
import RoomCard from "./RoomCard";
import ApartmentsCard from "./ApartmentsCard";
import EventHallCard from "./EventHallCard";
import DiscoCard from "./DiscoCard";
import TerraceCard from "./TerraceCard";
import PoolCard from "./PoolCard";
import { roomsAPI } from "../../services/api"; // ← NUEVO: Importar API para fetch
import "./Rooms.css";

const RoomsDestac = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));
  const [rooms, setRooms] = useState([]); // ← NUEVO: Estado para habitaciones destacadas
  const [loading, setLoading] = useState(false); // ← NUEVO: Estado de loading

  const tabs = [
    { key: "habitaciones", label: "Habitaciones", component: RoomCard },
    { key: "apartamentos", label: "Apartamentos", component: ApartmentsCard },
    { key: "sala-eventos", label: "Sala de Eventos", component: EventHallCard },
    { key: "discoteca", label: "Discoteca", component: DiscoCard },
    { key: "terraza", label: "Terraza", component: TerraceCard },
    { key: "piscina", label: "Piscina", component: PoolCard },
  ];

  function getTabFromPath(path) {
    return tabs.find((tab) => path.includes(tab.key))?.key || "habitaciones";
  }

  const ActiveComponent = tabs.find((tab) => tab.key === activeTab)?.component;

  // ← NUEVO: Fetch de habitaciones destacadas solo para el tab "habitaciones"
  useEffect(() => {
    if (activeTab === "habitaciones") {
      const fetchFeaturedRooms = async () => {
        try {
          setLoading(true);
          const response = await roomsAPI.getAll();
          const roomsData = Array.isArray(response)
            ? response
            : response.rooms || response.data || [];
          // Filtrar solo destacadas
          const featuredRooms = roomsData.filter(
            (room) => room.is_featured === true
          );
          setRooms(featuredRooms);
        } catch (err) {
          console.error("Error fetching featured rooms:", err);
          setRooms([]);
        } finally {
          setLoading(false);
        }
      };

      fetchFeaturedRooms();
    }
  }, [activeTab]); // Re-fetch cuando cambie el tab

  // Mock data para otros tabs (mantener)
  const mockData = {
    apartamentos: [
      { id: 1, name: "Apartamento Deluxe", capacity: 4 /* ... */ },
    ],
    // ... similar para otros tabs (sala-eventos, discoteca, etc.)
  };

  // ← MODIFICADO: Data dinámica basada en tab
  const data =
    activeTab === "habitaciones"
      ? rooms // Usar fetched rooms para habitaciones
      : mockData[activeTab] || []; // Mock para otros

  if (activeTab === "habitaciones" && loading) {
    return (
      <div className="rooms-page">
        <header className="rooms-header">
          <nav className="rooms-nav">
            {tabs.map((tab) => (
              <Link
                key={tab.key}
                to={`/rooms/${tab.key}`}
                className={`nav-tab ${activeTab === tab.key ? "active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="rooms-content">
          <div className="loading-container">
            <div className="loading-spinner">
              Cargando habitaciones destacadas...
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="rooms-page">
      {/* Header con Navegación */}
      <header className="rooms-header">
        <nav className="rooms-nav">
          {tabs.map((tab) => (
            <Link
              key={tab.key}
              to={`/rooms/${tab.key}`}
              className={`nav-tab ${activeTab === tab.key ? "active" : ""}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* Contenido: Grid de tarjetas */}
      <main className="rooms-content">
        <div className="facilities-grid">
          {data.map((item) => (
            <ActiveComponent
              key={item.id}
              {...{
                [activeTab === "habitaciones"
                  ? "room"
                  : activeTab.replace("-", "_")]: item,
              }}
            />
          ))}
        </div>
      </main>

      {/* Outlet para detalles si usas nested routes */}
      <Outlet />
    </div>
  );
};

export default RoomsDestac;
