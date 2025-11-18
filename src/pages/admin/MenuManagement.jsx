// src/admin/MenuManagement.jsx (actualizado: agrega sección para gestión del restaurante, con formulario para title, description, image; integra con menu items)
import React, { useState, useEffect } from "react";
import "./MenuManagement.css"; // Importa los estilos proporcionados
import { restaurantAPI } from "../../services/api";

const MenuManagement = () => {
  // Estados para menú
  const [menuItems, setMenuItems] = useState([]);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);
  const [menuFormData, setMenuFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [menuFile, setMenuFile] = useState(null);
  const [menuEditingId, setMenuEditingId] = useState(null);
  const [menuSubmitLoading, setMenuSubmitLoading] = useState(false);

  // Estados para restaurante
  const [restaurant, setRestaurant] = useState(null);
  const [restaurantLoading, setRestaurantLoading] = useState(true);
  const [restaurantError, setRestaurantError] = useState(null);
  const [restaurantFormData, setRestaurantFormData] = useState({
    title: "",
    description: "",
  });
  const [restaurantFile, setRestaurantFile] = useState(null);
  const [restaurantSubmitLoading, setRestaurantSubmitLoading] = useState(false);

  // Cargar menú al montar
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setMenuLoading(true);
        const items = await restaurantAPI.getMenu();
        setMenuItems(items);
      } catch (err) {
        console.error("Error al cargar menú:", err);
        setMenuError("No se pudieron cargar los ítems del menú");
      } finally {
        setMenuLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Cargar restaurante al montar
  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        setRestaurantLoading(true);
        const data = await restaurantAPI.get();
        setRestaurant(data);
        setRestaurantFormData({
          title: data.title,
          description: data.description,
        });
      } catch (err) {
        console.error("Error fetching restaurant:", err);
        setRestaurantError("No se pudo cargar la información del restaurante.");
        // Fallback a default
        if (err.message.includes("404")) {
          setRestaurantFormData({
            title: "Nuestro Restaurante Temático",
            description:
              "Disfruta de platos inspirados en las tabernas de fantasía, con ingredientes mágicos y un ambiente que te transporta a mundos épicos.",
          });
        }
      } finally {
        setRestaurantLoading(false);
      }
    };
    fetchRestaurant();
  }, []);

  // Handlers para menú (sin cambios)
  const handleMenuInputChange = (e) => {
    const { name, value } = e.target;
    setMenuFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMenuFileChange = (e) => {
    setMenuFile(e.target.files[0]);
  };

  const validateMenuForm = () => {
    const { name, description, price, category } = menuFormData;
    if (!name.trim()) return "El nombre es requerido";
    if (!description.trim()) return "La descripción es requerida";
    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0)
      return "El precio debe ser un número válido mayor a 0";
    if (!category.trim()) return "La categoría es requerida";
    if (!menuFile && !menuEditingId) return "La imagen es requerida";
    return null;
  };

  const handleMenuSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateMenuForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    const menuData = {
      name: menuFormData.name.trim(),
      description: menuFormData.description.trim(),
      price: parseFloat(menuFormData.price),
      category: menuFormData.category.trim(),
    };

    try {
      setMenuSubmitLoading(true);
      if (menuEditingId) {
        await restaurantAPI.updateMenu(menuEditingId, menuData, menuFile);
        alert("Ítem actualizado correctamente");
      } else {
        await restaurantAPI.createMenu(menuData, menuFile);
        alert("Ítem creado correctamente");
      }

      const items = await restaurantAPI.getMenu();
      setMenuItems(items);

      setMenuFormData({ name: "", description: "", price: "", category: "" });
      setMenuFile(null);
      setMenuEditingId(null);
      document.getElementById("menuFileInput").value = "";
    } catch (err) {
      console.error("Error en submit menú:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setMenuSubmitLoading(false);
    }
  };

  const handleMenuEdit = (item) => {
    setMenuFormData({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      category: item.category,
    });
    setMenuFile(null);
    setMenuEditingId(item.id);
  };

  const handleMenuDelete = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este ítem?")) return;
    try {
      await restaurantAPI.deleteMenu(id);
      const items = await restaurantAPI.getMenu();
      setMenuItems(items);
      alert("Ítem eliminado correctamente");
    } catch (err) {
      console.error("Error al eliminar:", err);
      alert("Error al eliminar ítem");
    }
  };

  // Handlers para restaurante
  const handleRestaurantInputChange = (e) => {
    const { name, value } = e.target;
    setRestaurantFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRestaurantFileChange = (e) => {
    setRestaurantFile(e.target.files[0]);
  };

  const validateRestaurantForm = () => {
    const { title, description } = restaurantFormData;
    if (!title.trim()) return "El título es requerido";
    if (!description.trim()) return "La descripción es requerida";
    if (!restaurantFile)
      return "La imagen es requerida para crear, opcional para actualizar";
    return null;
  };

  const handleRestaurantSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateRestaurantForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      setRestaurantSubmitLoading(true);
      // Asumimos ID=1 para el restaurante principal
      const restaurantId = 1;
      await restaurantAPI.update(
        restaurantId,
        restaurantFormData.title.trim(),
        restaurantFormData.description.trim(),
        restaurantFile
      );
      alert("Información del restaurante actualizada correctamente");

      // Recargar
      const updated = await restaurantAPI.get();
      setRestaurant(updated);
      setRestaurantFormData({
        title: updated.title,
        description: updated.description,
      });
      setRestaurantFile(null);
      document.getElementById("restaurantFileInput").value = "";
    } catch (err) {
      console.error("Error en submit restaurante:", err);
      alert(`Error: ${err.message}`);
      // Si es 404, crear
      if (err.message.includes("404")) {
        try {
          await restaurantAPI.create(
            restaurantFormData.title.trim(),
            restaurantFormData.description.trim(),
            restaurantFile
          );
          alert("Restaurante creado correctamente");
          const newRestaurant = await restaurantAPI.get();
          setRestaurant(newRestaurant);
          setRestaurantFormData({
            title: newRestaurant.title,
            description: newRestaurant.description,
          });
          setRestaurantFile(null);
          document.getElementById("restaurantFileInput").value = "";
        } catch (createErr) {
          console.error("Error al crear:", createErr);
          alert(`Error al crear: ${createErr.message}`);
        }
      }
    } finally {
      setRestaurantSubmitLoading(false);
    }
  };

  if (menuLoading || restaurantLoading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  // Mapeo de categorías a clases de badge (sin cambios)
  const getCategoryClass = (category) => {
    switch (category) {
      case "principal":
        return "main";
      case "entrada":
        return "appetizer";
      case "postre":
        return "dessert";
      case "bebida":
        return "drink";
      default:
        return "main";
    }
  };

  return (
    <div className="management-section">
      <h2 className="section-title">Gestión del Restaurante y Menú</h2>

      {/* Sección Restaurante */}
      <div className="form-container">
        <h3 className="form-title">Información del Restaurante</h3>
        {restaurantError && <div className="no-results">{restaurantError}</div>}
        <form onSubmit={handleRestaurantSubmit} className="restaurant-form">
          <div className="form-group">
            <label>Título:</label>
            <input
              type="text"
              name="title"
              value={restaurantFormData.title}
              onChange={handleRestaurantInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={restaurantFormData.description}
              onChange={handleRestaurantInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Imagen:</label>
            <input
              id="restaurantFileInput"
              type="file"
              accept="image/*"
              onChange={handleRestaurantFileChange}
              className="form-input"
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={restaurantSubmitLoading}
            >
              {restaurantSubmitLoading
                ? "Guardando..."
                : "Actualizar Restaurante"}
            </button>
          </div>
          {restaurant && (
            <div className="current-restaurant-preview">
              <h4>Vista Previa Actual:</h4>
              <p>
                <strong>{restaurant.title}</strong>
              </p>
              <p>{restaurant.description}</p>
              {restaurant.image_url && (
                <img src={restaurant.image_url} alt="Preview" width="200" />
              )}
            </div>
          )}
        </form>
      </div>

      {/* Sección Menú (sin cambios) */}
      <div className="form-container">
        <h3 className="form-title">
          {menuEditingId ? "Editar Ítem del Menú" : "Nuevo Ítem del Menú"}
        </h3>
        {menuError && <div className="no-results">{menuError}</div>}
        <form onSubmit={handleMenuSubmit} className="menu-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              type="text"
              name="name"
              value={menuFormData.name}
              onChange={handleMenuInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              name="description"
              value={menuFormData.description}
              onChange={handleMenuInputChange}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Precio:</label>
            <input
              type="number"
              name="price"
              value={menuFormData.price}
              onChange={handleMenuInputChange}
              step="0.01"
              min="0"
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label>Categoría:</label>
            <select
              name="category"
              value={menuFormData.category}
              onChange={handleMenuInputChange}
              className="form-input"
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="entrada">Entrada</option>
              <option value="principal">Principal</option>
              <option value="postre">Postre</option>
              <option value="bebida">Bebida</option>
            </select>
          </div>
          <div className="form-group">
            <label>Imagen:</label>
            <input
              id="menuFileInput"
              type="file"
              accept="image/*"
              onChange={handleMenuFileChange}
              className="form-input"
              required={!menuEditingId}
            />
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={menuSubmitLoading}
            >
              {menuSubmitLoading
                ? "Guardando..."
                : menuEditingId
                ? "Actualizar"
                : "Crear"}
            </button>
            {menuEditingId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setMenuEditingId(null)}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de ítems del menú (sin cambios) */}
      <div className="menu-list">
        <h3 className="form-title">Ítems del Menú</h3>
        {menuItems.length === 0 ? (
          <div className="no-results">No hay ítems en el menú</div>
        ) : (
          <div className="grid-container">
            {menuItems.map((item) => (
              <div key={item.id} className="menu-item-card-admin">
                <div className="item-header">
                  <h4 className="card-title">{item.name}</h4>
                  <span
                    className={`category-badge ${getCategoryClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>
                <div className="card-meta">
                  <p>{item.description}</p>
                </div>
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="item-image"
                  />
                )}
                <div className="card-price">€ {item.price}</div>
                <div className="card-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => handleMenuEdit(item)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => handleMenuDelete(item.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuManagement;
