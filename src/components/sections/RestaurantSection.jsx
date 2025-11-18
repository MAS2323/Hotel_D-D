// src/components/sections/RestaurantSection.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { restaurantAPI } from "../../services/api";
import "./RestaurantSection.css";

const RestaurantSection = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const data = await restaurantAPI.get();
        setRestaurant(data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setError("No se pudo cargar la información del restaurante.");
        // Fallback a datos hardcodeados si 404
        if (err.message.includes("404")) {
          setRestaurant({
            title: "Nuestro Restaurante Temático",
            description:
              "Disfruta de platos inspirados en las tabernas de fantasía, con ingredientes mágicos y un ambiente que te transporta a mundos épicos.",
            image_url:
              "https://via.placeholder.com/800x400?text=Restaurante+D&D",
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  if (loading) return <div className="loading-spinner">Cargando...</div>;

  return (
    <section className="restaurant-section">
      <div className="restaurant-container">
        <div className="restaurant-text-overlay">
          <h2 className="restaurant-title">{restaurant?.title}</h2>
          <p className="restaurant-description">{restaurant?.description}</p>
        </div>
        <img
          src={
            restaurant?.image_url ||
            "https://via.placeholder.com/800x400?text=Restaurante+D&D"
          }
          alt="Restaurante"
          className="restaurant-image"
        />
        <Link to="/menu" className="restaurant-button">
          Ver Menú
        </Link>
      </div>
    </section>
  );
};

export default RestaurantSection;
