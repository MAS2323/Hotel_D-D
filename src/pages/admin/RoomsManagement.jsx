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
    is_available: true,
  });
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [search, setSearch] = useState("");

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
    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description || "");
    form.append("price", formData.price);
    form.append("is_available", formData.is_available);

    // alt_list (una por imagen)
    newImages.forEach((_, i) =>
      form.append("alt_list", formData.alt || `Imagen ${i + 1}`)
    );

    // files (nombre exacto que espera tu backend)
    newImages.forEach((file) => form.append("files", file));

    try {
      if (editing) await roomsAPI.update(editing, form);
      else await roomsAPI.create(form);
      fetchRooms();
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Error al guardar habitación");
    }
  };

  // ---------- UTILS ----------
  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", is_available: true });
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
      is_available: room.is_available,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta habitación?")) return;
    try {
      await roomsAPI.delete(id);
      setRooms((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error al eliminar habitación");
    }
  };

  // helper to provide authorization headers (adjust to your auth storage)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(
        `http://localhost:8000/admin/rooms/${id}/status`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json", ...getAuthHeaders() },
          body: JSON.stringify({ is_available: newStatus }),
        }
      );
      if (!res.ok) throw new Error("Error al cambiar estado");
      const updated = await res.json();
      setRooms((prev) => prev.map((r) => (r.id === id ? updated : r)));
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado");
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

        {/* SUBIDA DE IMÁGENES */}

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
          <button type="submit" className="btn btn-primary">
            {editing ? "Actualizar" : "Crear"}
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
              <p className="card-description">{room.description}</p>
              <p className="card-price">Precio: ${room.price}/noche</p>
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
    </div>
  );
}
