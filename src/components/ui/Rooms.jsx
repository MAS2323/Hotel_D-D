import React, { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Para nested routes
import RoomCard from "../components/ui/RoomCard";
import ApartmentsCard from "../components/ui/ApartmentsCard";
import EventHallCard from "../components/ui/EventHallCard";
import DiscoCard from "../components/ui/DiscoCard";
import TerraceCard from "../components/ui/TerraceCard";
import PoolCard from "../components/ui/PoolCard";
import "./Rooms.css";

const Rooms = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(getTabFromPath(location.pathname));

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

  // Mock data (reemplaza con fetch API)
  const mockData = {
    habitaciones: [
      { id: 1, name: "Habitación Confort Doble", size: 25 /* ... */ },
    ],
    apartamentos: [
      { id: 1, name: "Apartamento Deluxe", capacity: 4 /* ... */ },
    ],
    // ... similar para otros
  };

  const data = mockData[activeTab] || [];

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

export default Rooms;
