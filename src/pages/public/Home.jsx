// src/pages/Home.js
import { useState, useEffect } from "react";
import Hero from "../../components/common/Hero";
import RoomCard from "../../components/ui/RoomCard";
import TestimonialCard from "../../components/ui/TestimonialCard";
import Gallery from "../../components/ui/Gallery";
import { roomsAPI } from "../../services/api";
import RestaurantSection from "../../components/sections/RestaurantSection";
import ServicesSection from "../../components/sections/ServicesSection";
import "./Home.css";

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
    roomsAPI.getAll().then((res) => setFeaturedRooms(res.data.slice(0, 3)));
  }, []);

  return (
    <>
      <Hero />
      <section className="home-section-white">
        <div className="home-container">
          <h2 className="home-section-title">Habitaciones Destacadas</h2>
          <div className="home-rooms-grid">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
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
