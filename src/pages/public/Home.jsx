// src/pages/Home.js
import { useState, useEffect } from "react";
import Hero from "../../components/common/Hero";
import RoomCard from "../../components/ui/RoomCard"; // ← CAMBIO: Usar RoomCard en lugar de RoomsDestac
import TestimonialCard from "../../components/ui/TestimonialCard";
import Gallery from "../../components/ui/Gallery";
import { roomsAPI } from "../../services/api";
import RestaurantSection from "../../components/sections/RestaurantSection";
import ServicesSection from "../../components/sections/ServicesSection";
import "./Home.css";
// ← ELIMINAR: import RoomsDestac from "../../components/ui/RoomsDestac";

const testimonials = [
  {
    quote:
      "¡Una noche en la Cueva del Dragón fue épica! El hotel capturó la magia de D&D perfectamente.",
    author: "Elfo Viajero",
  },
  {
    quote:
      "Servicio impecable y habitaciones temáticas. ¡Volveré por más quests!",
    author: "Mago Errante",
  },
];

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const response = await roomsAPI.getAll();
        // Maneja la respuesta (ajusta según tu API)
        const roomsData = Array.isArray(response)
          ? response
          : response.rooms || response.data || [];

        // ← NUEVO: Filtrar solo habitaciones destacadas (is_featured === true)
        const featured = roomsData
          .filter((room) => room.is_featured === true)
          .slice(0, 3);

        console.log("Featured rooms in Home:", featured); // Para debug
        setFeaturedRooms(featured);
      } catch (err) {
        console.error("Error fetching featured rooms:", err);
        setFeaturedRooms([]);
      }
    };

    fetchFeaturedRooms();
  }, []);

  return (
    <>
      <Hero />
      <section className="home-section-white">
        <div className="home-container">
          <h2 className="home-section-title">Habitaciones Destacadas</h2>
          <div className="home-rooms-grid">
            {featuredRooms.length > 0 ? (
              // ← CAMBIO: Renderizar RoomCard para cada habitación destacada
              featuredRooms.map((room) => (
                <RoomCard key={room.id} room={room} />
              ))
            ) : (
              <p>No hay habitaciones destacadas disponibles en este momento.</p>
            )}
          </div>
        </div>
      </section>
      <section className="home-section-gray">
        <div className="home-container">
          <h2 className="home-section-title">
            Lo Que Dicen Nuestros Huéspedes
          </h2>
          <div className="home-testimonials-grid">
            {testimonials.map((t, i) => (
              <TestimonialCard key={i} testimonial={t} />
            ))}
          </div>
        </div>
      </section>
      <RestaurantSection />
      <ServicesSection />
      <Gallery />
    </>
  );
};

export default Home;
