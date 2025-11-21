// src/pages/Home.js
import { useState, useEffect } from "react";
import Hero from "../../components/common/Hero";
import RoomCard from "../../components/ui/RoomCard";
import TestimonialCard from "../../components/ui/TestimonialCard";
import Gallery from "../../components/ui/Gallery";
import { roomsAPI, testimonialsAPI } from "../../services/api";
import RestaurantSection from "../../components/sections/RestaurantSection";
import ServicesSection from "../../components/sections/ServicesSection";
import { Link } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  useEffect(() => {
    const fetchFeaturedRooms = async () => {
      try {
        const response = await roomsAPI.getAll();
        const roomsData = Array.isArray(response)
          ? response
          : response.rooms || response.data || [];

        const featured = roomsData
          .filter((room) => room.is_featured === true)
          .slice(0, 3);

        console.log("Featured rooms in Home:", featured);
        setFeaturedRooms(featured);
      } catch (err) {
        console.error("Error fetching featured rooms:", err);
        setFeaturedRooms([]);
      }
    };

    fetchFeaturedRooms();
  }, []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoadingTestimonials(true);
        const response = await testimonialsAPI.getAll(0, 5); // Limit to 5 recent
        const testimonialsData = Array.isArray(response)
          ? response
          : response.testimonials || response.data || [];
        setTestimonials(testimonialsData);
      } catch (err) {
        console.error("Error fetching testimonials:", err);
        setTestimonials([
          {
            id: 1,
            content:
              "¡Una noche en la Cueva del Dragón fue épica! El hotel capturó la magia de D&D perfectamente.",
            author: "Elfo Viajero",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            content:
              "Servicio impecable y habitaciones temáticas. ¡Volveré por más quests!",
            author: "Mago Errante",
            created_at: new Date().toISOString(),
          },
        ]);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loadingTestimonials) {
    return (
      <section className="home-section-gray">
        <div className="home-container">
          <h2 className="home-section-title">
            Lo Que Dicen Nuestros Huéspedes
          </h2>
          <div className="home-testimonials-grid">
            <p>Cargando testimonios...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <Hero />
      <section className="home-section-white">
        <div className="home-container">
          <h2 className="home-section-title">Habitaciones Destacadas</h2>
          <div className="home-rooms-grid">
            {featuredRooms.length > 0 ? (
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
            {testimonials.map((t) => (
              <TestimonialCard key={t.id} testimonial={t} />
            ))}
          </div>
          <div className="submit-testimonial-section">
            <Link to="/submit-testimonial" className="submit-testimonial-btn">
              ¿Has visitado nuestro hotel? ¡Comparte tu experiencia!
            </Link>
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
