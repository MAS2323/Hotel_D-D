// components/admin/ApartmentAdmin.js (renombrado y actualizado con nuevos campos)
import React, { useState, useEffect } from "react";
import { apartmentsAPI } from "../../services/api"; // ✅ Usando apartmentsAPI
import "./ApartmentAdmin.css"; // CSS opcional

const ApartmentAdmin = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Ahora será string
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head: "",
    email: "",
    phone: "",
    capacity: 2,
    price_per_night: 0.0,
    amenities: [], // Array para amenidades (puede ser input múltiple o textarea separada por comas)
    num_bedrooms: 1,
    num_bathrooms: 1,
    square_meters: null,
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageAlts, setImageAlts] = useState([]);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      setError(null); // Limpia error previo
      const response = await apartmentsAPI.getAll();
      const loadedApartments = Array.isArray(response)
        ? response
        : response.data || response.apartments || [];
      setApartments(loadedApartments);

      // Si no hay apartamentos, abrir el formulario de creación automáticamente
      if (loadedApartments.length === 0 && !editingId && !showModal) {
        resetForm();
        setShowModal(true);
      }
    } catch (err) {
      const errorMsg = err.message || "Error al cargar apartamentos";
      console.error(err);
      setError(errorMsg); // Solo el mensaje como string
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleNumberChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: parseFloat(e.target.value) || 0,
    });
  };

  const handleAmenitiesChange = (e) => {
    // Asumir input separado por comas
    const amenities = e.target.value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData({ ...formData, amenities });
  };

  const handleImageFilesChange = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const handleImageAltsChange = (index, value) => {
    const newAlts = [...imageAlts];
    newAlts[index] = value;
    setImageAlts(newAlts);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError(null); // Limpia error previo
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("head", formData.head);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("capacity", formData.capacity);
      formDataToSend.append("price_per_night", formData.price_per_night);
      formDataToSend.append("amenities", JSON.stringify(formData.amenities)); // JSON para array
      formDataToSend.append("num_bedrooms", formData.num_bedrooms);
      formDataToSend.append("num_bathrooms", formData.num_bathrooms);
      formDataToSend.append("square_meters", formData.square_meters || "");
      formDataToSend.append("is_active", formData.is_active.toString());

      // Agregar metadatos de imágenes
      imageFiles.forEach((file, index) => {
        formDataToSend.append("files", file);
        formDataToSend.append(`alt_list`, imageAlts[index] || ""); // alt_list como array de strings
      });

      if (editingId) {
        await apartmentsAPI.update(editingId, formDataToSend);
      } else {
        await apartmentsAPI.create(formDataToSend);
      }
      fetchApartments(); // Recarga la lista después de crear/editar
      resetForm();
      setShowModal(false);
    } catch (err) {
      const errorMsg = err.message || "Error al guardar el apartamento";
      console.error(err);
      setError(errorMsg); // Solo el mensaje como string
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      head: "",
      email: "",
      phone: "",
      capacity: 2,
      price_per_night: 0.0,
      amenities: [],
      num_bedrooms: 1,
      num_bathrooms: 1,
      square_meters: null,
      is_active: true,
    });
    setEditingId(null);
    setImageFiles([]);
    setImageAlts([]);
  };

  const handleEdit = (apt) => {
    setFormData({
      name: apt.name,
      description: apt.description,
      head: apt.head,
      email: apt.email,
      phone: apt.phone,
      capacity: apt.capacity,
      price_per_night: apt.price_per_night,
      amenities: apt.amenities || [],
      num_bedrooms: apt.num_bedrooms,
      num_bathrooms: apt.num_bathrooms,
      square_meters: apt.square_meters,
      is_active: apt.is_active,
    });
    setEditingId(apt.id); // Ajuste: usar id en lugar de _id
    // Pre-cargar imágenes si existen (opcional: setImageFiles(apt.images.map(img => new File(...))) pero complejo, omitido por simplicidad
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) {
      try {
        setError(null);
        await apartmentsAPI.delete(id); // Ajuste: id numérico
        fetchApartments();
      } catch (err) {
        const errorMsg = err.message || "Error al eliminar el apartamento";
        console.error(err);
        setError(errorMsg);
      }
    }
  };

  if (loading) return <div className="loading-container">Cargando...</div>;
  if (error) return <div className="error-container">{error}</div>; // Ahora string

  return (
    <section className="apartment-admin">
      <h2>Administrar Apartamentos</h2>
      <button
        onClick={() => {
          setShowModal(true);
          resetForm();
        }}
        className="add-btn"
      >
        Agregar Apartamento
      </button>

      {!apartments || apartments.length === 0 ? (
        <div className="empty-state">
          <p>No hay apartamentos disponibles. Crea el primero para comenzar.</p>
          {/* El botón ya está arriba, y el modal se abre automáticamente si vacío */}
        </div>
      ) : (
        <table className="apartments-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Jefe</th>
              <th>Email</th>
              <th>Capacidad</th>
              <th>Precio/Noche</th>
              <th>Habitaciones</th>
              <th>Baños</th>
              <th>m²</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {apartments.map((apt) => (
              <tr key={apt.id}>
                {/* Ajuste: usar id en lugar de _id */}
                <td>{apt.name}</td>
                <td>{apt.description.substring(0, 50)}...</td>
                <td>{apt.head}</td>
                <td>{apt.email}</td>
                <td>{apt.capacity}</td>
                <td>${apt.price_per_night}</td>
                <td>{apt.num_bedrooms}</td>
                <td>{apt.num_bathrooms}</td>
                <td>{apt.square_meters}</td>
                <td>{apt.is_active ? "Activo" : "Inactivo"}</td>
                <td>
                  <button onClick={() => handleEdit(apt)}>Editar</button>
                  <button onClick={() => handleDelete(apt.id)}>
                    Eliminar
                  </button>{" "}
                  {/* Ajuste: apt.id */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? "Editar" : "Agregar"} Apartamento</h3>
            {error && <p className="error-message">{error}</p>}{" "}
            {/* Mostrar error en modal si aplica */}
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Nombre"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="description"
                placeholder="Descripción"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
              <input
                name="head"
                placeholder="Jefe"
                value={formData.head}
                onChange={handleInputChange}
                required
              />
              <input
                name="email"
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                name="phone"
                placeholder="Teléfono"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
              <input
                name="capacity"
                type="number"
                placeholder="Capacidad (huéspedes)"
                value={formData.capacity}
                onChange={handleNumberChange}
                min="1"
              />
              <input
                name="price_per_night"
                type="number"
                step="0.01"
                placeholder="Precio por noche"
                value={formData.price_per_night}
                onChange={handleNumberChange}
                min="0"
              />
              <input
                name="amenities"
                placeholder="Amenidades (separadas por comas)"
                value={formData.amenities.join(", ")}
                onChange={handleAmenitiesChange}
              />
              <input
                name="num_bedrooms"
                type="number"
                placeholder="Número de habitaciones"
                value={formData.num_bedrooms}
                onChange={handleNumberChange}
                min="1"
              />
              <input
                name="num_bathrooms"
                type="number"
                placeholder="Número de baños"
                value={formData.num_bathrooms}
                onChange={handleNumberChange}
                min="1"
              />
              <input
                name="square_meters"
                type="number"
                step="0.01"
                placeholder="Metros cuadrados"
                value={formData.square_meters || ""}
                onChange={handleInputChange}
              />
              <label>
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleCheckboxChange}
                />
                Activo
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageFilesChange}
              />
              {imageFiles.map((file, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Alt para imagen ${index + 1}`}
                  value={imageAlts[index] || ""}
                  onChange={(e) => handleImageAltsChange(index, e.target.value)}
                />
              ))}
              <button type="submit">
                {editingId ? "Actualizar" : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ApartmentAdmin;
