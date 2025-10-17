// src/components/sections/RestaurantSection.js
import "./RestaurantSection.css";

const RestaurantSection = () => {
  return (
    <section className="restaurant-section">
      <div className="restaurant-container">
        <h2 className="restaurant-title">Nuestro Restaurante Temático</h2>
        <p className="restaurant-description">
          Disfruta de platos inspirados en las tabernas de fantasía, con
          ingredientes mágicos y un ambiente que te transporta a mundos épicos.
        </p>
        <img
          src="https://via.placeholder.com/800x400?text=Restaurante+D&D"
          alt="Restaurante"
          className="restaurant-image"
        />
        <button className="restaurant-button">Ver Menú</button>
      </div>
    </section>
  );
};

export default RestaurantSection;
