// src/components/sections/MenuView.js
import { useState, useEffect } from "react";
import { restaurantAPI } from "../../services/api";
import "./MenuView.css"; // Estilos similares a RestaurantSection

const MenuView = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const data = await restaurantAPI.getMenu();
        setMenuItems(data);
      } catch (err) {
        console.error("Error fetching menu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredItems =
    selectedCategory === "all"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  if (loading) return <div className="loading-spinner">Cargando menú...</div>;

  return (
    <section className="menu-section">
      <div className="menu-container">
        <h2 className="menu-title">Menú del Restaurante</h2>
        <div className="category-filter">
          <button
            onClick={() => setSelectedCategory("all")}
            className={selectedCategory === "all" ? "active" : ""}
          >
            Todo
          </button>
          <button
            onClick={() => setSelectedCategory("appetizer")}
            className={selectedCategory === "appetizer" ? "active" : ""}
          >
            Entradas
          </button>
          <button
            onClick={() => setSelectedCategory("main")}
            className={selectedCategory === "main" ? "active" : ""}
          >
            Platos Principales
          </button>
          <button
            onClick={() => setSelectedCategory("dessert")}
            className={selectedCategory === "dessert" ? "active" : ""}
          >
            Postres
          </button>
          <button
            onClick={() => setSelectedCategory("drink")}
            className={selectedCategory === "drink" ? "active" : ""}
          >
            Bebidas
          </button>
        </div>
        <div className="menu-grid">
          {filteredItems.map((item) => (
            <div key={item.id} className="menu-item-card">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="menu-item-image"
                />
              )}
              <h3 className="menu-item-name">{item.name}</h3>
              <p className="menu-item-description">{item.description}</p>
              <p className="menu-item-price">{item.price} XAF</p>
              <button className="add-to-order-btn">Agregar al Pedido</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuView;
