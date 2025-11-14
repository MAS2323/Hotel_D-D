import React, { useEffect, useState } from "react";
import { roomsAPI } from "../../services/api";
import "./RoomsManagement.css";

export default function RoomsManagement() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    size: "",
    bed_type: "",
    is_available: true,
    is_featured: false,
    alt: "",
    amenities: {}, // Nuevo: { "5": true, "6": false, ... }
    max_guests: 2,
    has_tv: true,
    has_balcony: false,
  });
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Arrays de amenidades (como proporcionaste)
  const amenitiesLeft = [
    {
      id: 1,
      icon: "📏",
      label: `Tamaño de habitación: ${formData.size || 25} m²`, // Dinámico, pero no se selecciona
    },
    {
      id: 2,
      icon: "👥",
      label: `Adecuado para ${2} huéspedes`, // Dinámico via max_guests
    },
    { id: 5, icon: "🌅", label: "Área de estar" },
    { id: 6, icon: "🌡️", label: "Aire acondicionado" },
    { id: 7, icon: "🔒", label: "Caja fuerte" },
    { id: 8, icon: "🚿", label: "Baño o ducha" },
    { id: 9, icon: "🛁", label: "Secador de pelo" },
    { id: 10, icon: "🚭", label: "Habitaciones no fumadores" },
  ];

  const amenitiesRight = [
    { id: 0, icon: "🛏️", label: "Cama doble" }, // Dinámico via bed_type
    { id: 4, icon: "📺", label: "Televisión de pantalla plana" }, // Via has_tv
    { id: 11, icon: "🛎️", label: "Servicio de despertador" },
    { id: 12, icon: "🔐", label: "Cerradura de seguridad" },
    { id: 13, icon: "📶", label: "Wi-Fi gratuito" },
    { id: 14, icon: "🥤", label: "Minibar gratuito" },
    { id: 15, icon: "🔌", label: "Hervidor" },
    { id: 16, icon: "☕", label: "Máquina de café Nespresso" },
    { id: 17, icon: "📞", label: "Teléfono" },
  ];

  // Filtrar amenidades fijas (excluir dinámicas: 0,1,2,4)
  const fixedAmenitiesLeft = amenitiesLeft.filter(
    (a) => ![1, 2].includes(a.id)
  );
  const fixedAmenitiesRight = amenitiesRight.filter((a) => a.id !== 4);

  // ---------- CARGAR HABITACIONES ----------
  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const data = await roomsAPI.getAll();
      setRooms(Array.isArray(data) ? data : data.rooms || []);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar las habitaciones");
    } finally {
      setLoading(false);
    }
  };

  // ---------- BÚSQUEDA ----------
  const filtered = rooms.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description?.toLowerCase().includes(search.toLowerCase())
  );

  // ---------- MANEJO DE AMENIDADES ----------
  const handleAmenityChange = (id, checked) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [id]: checked,
      },
    }));
  };

  // ---------- IMÁGENES ----------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
    setPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const removePreview = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description || "");
    form.append("price", formData.price);
    form.append("size", formData.size);
    form.append("max_guests", formData.max_guests || 2); // Asumiendo que agregas este campo si no lo tienes
    form.append("bed_type", formData.bed_type);
    form.append("has_tv", formData.has_tv || true); // Asumiendo campo
    form.append("is_available", formData.is_available);
    form.append("is_featured", formData.is_featured || false);
    form.append("alt", formData.alt || "Imagen de habitación");
    form.append("amenities", JSON.stringify(formData.amenities || {})); // Nuevo: Enviar como JSON string
    form.append("has_balcony", formData.has_balcony || false);

    newImages.forEach((file) => form.append("files", file));
    newImages.forEach((_, i) =>
      form.append("alt_list", formData.alt || `Imagen ${i + 1}`)
    );

    try {
      if (editing) {
        await roomsAPI.update(editing, form);
      } else {
        await roomsAPI.create(form);
      }
      fetchRooms();
      resetForm();
      alert("✅ Habitación guardada exitosamente");
    } catch (err) {
      console.error("❌ Error:", err);
      const msg = err.message.includes("422")
        ? JSON.parse(err.message.split(": ")[1])?.detail?.[0]?.msg ||
          "Validación falló"
        : err.message;
      alert("Error al guardar habitación: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- UTILS ----------
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      size: "",
      bed_type: "",
      alt: "",
      is_available: true,
      is_featured: false,
      amenities: {}, // Reset
      max_guests: 2,
      has_tv: true,
      has_balcony: false,
    });
    setNewImages([]);
    setPreviews([]);
    setEditing(null);
  };

  const handleEdit = (room) => {
    setEditing(room.id);
    setFormData({
      name: room.name,
      description: room.description || "",
      price: room.price,
      size: room.size || "",
      bed_type: room.bed_type || "",
      alt: room.images?.[0]?.alt || "",
      is_available: room.is_available,
      is_featured: room.is_featured || false,
      amenities: room.amenities || {}, // Nuevo: Cargar amenidades
      max_guests: room.max_guests || 2,
      has_tv: room.has_tv || true,
      has_balcony: room.has_balcony || false,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta habitación?")) return;
    try {
      await roomsAPI.delete(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      const msg = err.message || err;
      alert("No se pudo eliminar: " + msg);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const fd = new FormData();
      fd.append("is_available", newStatus);
      const updated = await roomsAPI.update(id, fd);
      setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado: " + (err.message || err));
    }
  };

  if (loading)
    return <div className="loading-spinner">Cargando habitaciones…</div>;

  return (
    <div className="management-section">
      <h2 className="section-title">Gestión de Habitaciones</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o descripción…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="form-container">
        <h3 className="form-title">
          {editing ? "Editar Habitación" : "Crear Habitación"}
        </h3>

        <input
          type="text"
          placeholder="Nombre de la habitación"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="form-input"
          required
        />
        <textarea
          placeholder="Descripción"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="form-textarea"
          rows={3}
        />
        <input
          type="number"
          placeholder="Precio por noche"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          className="form-input"
          required
        />
        <input
          type="number"
          step="0.1"
          placeholder="Tamaño en m² (ej: 25.5)"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          className="form-input"
          required
        />
        <select
          value={formData.bed_type}
          onChange={(e) =>
            setFormData({ ...formData, bed_type: e.target.value })
          }
          className="form-input"
          required
        >
          <option value="">Seleccionar tipo de cama</option>
          <option value="doble">Doble</option> {/* Ajusté para matching */}
          <option value="queen">Queen</option>
          <option value="king">King</option>
          <option value="twin">Twin</option>
        </select>
        <input
          type="text"
          placeholder="Texto alt para imágenes (opcional)"
          value={formData.alt}
          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
          className="form-input"
        />
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={formData.is_available}
            onChange={(e) =>
              setFormData({ ...formData, is_available: e.target.checked })
            }
          />
          Disponible
        </label>
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={formData.is_featured}
            onChange={(e) =>
              setFormData({ ...formData, is_featured: e.target.checked })
            }
          />
          Habitación Destacada
        </label>

        {/* NUEVA SECCIÓN: Selección de Amenidades */}
        <h4>Amenidades (selecciona las que aplica)</h4>
        <div className="amenities-grid">
          <div className="amenities-left">
            <ul className="amenities-list">
              {fixedAmenitiesLeft.map((amenity) => (
                <li key={amenity.id} className="amenity-item">
                  <input
                    type="checkbox"
                    id={`amenity-left-${amenity.id}`}
                    checked={formData.amenities[amenity.id] || false}
                    onChange={(e) =>
                      handleAmenityChange(amenity.id, e.target.checked)
                    }
                  />
                  <label htmlFor={`amenity-left-${amenity.id}`}>
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-label">{amenity.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="amenities-right">
            <ul className="amenities-list">
              {fixedAmenitiesRight.map((amenity) => (
                <li key={amenity.id} className="amenity-item">
                  <input
                    type="checkbox"
                    id={`amenity-right-${amenity.id}`}
                    checked={formData.amenities[amenity.id] || false}
                    onChange={(e) =>
                      handleAmenityChange(amenity.id, e.target.checked)
                    }
                  />
                  <label htmlFor={`amenity-right-${amenity.id}`}>
                    <span className="amenity-icon">{amenity.icon}</span>
                    <span className="amenity-label">{amenity.label}</span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h4>Agregar nuevas imágenes</h4>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          className="form-file"
        />
        {previews.length > 0 && (
          <div className="preview-grid">
            {previews.map((url, idx) => (
              <div key={idx} className="preview-item">
                <img
                  src={url}
                  alt={`preview-${idx}`}
                  className="preview-image"
                />
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => removePreview(idx)}
                  title="Eliminar imagen"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Procesando…" : editing ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>

      <div className="grid-container">
        {filtered.map((room) => (
          <div key={room.id} className="room-card-admin">
            {room.images?.[0] && (
              <img
                src={room.images[0].url}
                alt={room.images[0].alt}
                className="room-main-image"
              />
            )}

            <div className="room-card-content">
              <h3 className="card-title">{room.name}</h3>
              {room.is_featured && (
                <span className="featured-badge">⭐ Destacada</span>
              )}
              <p className="card-description">{room.description}</p>
              <p className="card-price">Precio: XAF{room.price}/noche</p>
              <p className="card-meta">
                Tamaño: {room.size} m² | Cama: {room.bed_type}
              </p>
              <span
                className={`status-badge ${
                  room.is_available ? "available" : "occupied"
                }`}
              >
                {room.is_available ? "Disponible" : "Ocupada"}
              </span>

              {room.images && room.images.length > 0 && (
                <div className="room-mini-gallery">
                  {room.images.slice(0, 3).map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={img.alt}
                      className="mini-image"
                    />
                  ))}
                </div>
              )}

              <div className="card-actions">
                <button
                  onClick={() => handleEdit(room)}
                  className="btn btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() =>
                    handleStatusChange(room.id, !room.is_available)
                  }
                  className="btn btn-toggle"
                >
                  {room.is_available ? "Marcar ocupada" : "Marcar disponible"}
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="btn btn-delete"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="no-results">No se encontraron habitaciones.</p>
      )}

      {submitting && (
        <div className="overlay-loader">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
