// components/admin/ApartmentAdmin.js (refactorizado para parecerse a RoomsManagement)
import React, { useEffect, useState } from "react";
import { apartmentsAPI } from "../../services/api";
import "./ApartmentAdmin.css";

export default function ApartmentAdmin() {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head: "",
    email: "",
    phone: "",
    capacity: 2,
    price_per_night: 0.0,
    amenities: {}, // { id: true } para checkboxes
    num_bedrooms: 1,
    num_bathrooms: 1,
    square_meters: null,
    is_active: true,
  });
  const [newImages, setNewImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [imageAlts, setImageAlts] = useState([]); // Array para alts de nuevas imágenes
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Arrays de amenidades adaptadas para apartamentos
  const amenitiesLeft = [
    { id: 1, icon: "📏", label: `Tamaño: ${formData.square_meters || 50} m²` }, // Dinámico
    {
      id: 2,
      icon: "👥",
      label: `Capacidad: ${formData.capacity || 2} huéspedes`,
    }, // Dinámico
    { id: 3, icon: "🛏️", label: "Múltiples habitaciones" },
    { id: 4, icon: "🚿", label: "Baños completos" },
    { id: 5, icon: "🍳", label: "Cocina equipada" },
    { id: 6, icon: "🧺", label: "Lavadora/Secadora" },
    { id: 7, icon: "🌡️", label: "Aire acondicionado" },
  ];

  const amenitiesRight = [
    { id: 8, icon: "📺", label: "Televisión" },
    { id: 9, icon: "📶", label: "Wi-Fi gratuito" },
    { id: 10, icon: "🔒", label: "Caja fuerte" },
    { id: 11, icon: "🚪", label: "Balcón/Terraza" },
    { id: 12, icon: "🚗", label: "Estacionamiento" },
    { id: 13, icon: "♿", label: "Accesible para discapacitados" },
    { id: 14, icon: "👨‍💼", label: "Servicio de limpieza" },
  ];

  // Filtrar amenidades fijas (excluir dinámicas: 1,2)
  const fixedAmenitiesLeft = amenitiesLeft.filter(
    (a) => ![1, 2].includes(a.id)
  );
  const fixedAmenitiesRight = amenitiesRight;

  // ---------- CARGAR APARTAMENTOS ----------
  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async () => {
    try {
      setLoading(true);
      const data = await apartmentsAPI.getAll();
      setApartments(Array.isArray(data) ? data : data.apartments || []);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar los apartamentos");
    } finally {
      setLoading(false);
    }
  };

  // ---------- BÚSQUEDA ----------
  const filtered = apartments.filter(
    (apt) =>
      apt.name.toLowerCase().includes(search.toLowerCase()) ||
      apt.description?.toLowerCase().includes(search.toLowerCase())
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
    // Inicializar alts para nuevas imágenes
    setImageAlts(files.map(() => ""));
  };

  const removePreview = (idx) => {
    setNewImages((prev) => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setImageAlts((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleImageAltChange = (idx, value) => {
    const newAlts = [...imageAlts];
    newAlts[idx] = value;
    setImageAlts(newAlts);
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description || "");
    form.append("head", formData.head || "");
    form.append("email", formData.email || "");
    form.append("phone", formData.phone || "");
    form.append("capacity", formData.capacity || 2);
    form.append("price_per_night", formData.price_per_night || 0);
    // Convertir amenities object a array de labels
    const selectedAmenities = Object.keys(formData.amenities)
      .filter((key) => formData.amenities[key])
      .map(
        (key) =>
          amenitiesLeft.find((a) => a.id == key)?.label ||
          amenitiesRight.find((a) => a.id == key)?.label ||
          key
      )
      .filter(Boolean);
    form.append("amenities", JSON.stringify(selectedAmenities));
    form.append("num_bedrooms", formData.num_bedrooms || 1);
    form.append("num_bathrooms", formData.num_bathrooms || 1);
    form.append("square_meters", formData.square_meters || "");
    form.append("is_active", formData.is_active);

    newImages.forEach((file) => form.append("files", file));
    imageAlts.forEach((alt) =>
      form.append("alt_list", alt || "Imagen de apartamento")
    );

    try {
      if (editing) {
        await apartmentsAPI.update(editing, form);
      } else {
        await apartmentsAPI.create(form);
      }
      fetchApartments();
      resetForm();
      alert("✅ Apartamento guardado exitosamente");
    } catch (err) {
      console.error("❌ Error:", err);
      const msg = err.message.includes("422")
        ? JSON.parse(err.message.split(": ")[1])?.detail?.[0]?.msg ||
          "Validación falló"
        : err.message;
      alert("Error al guardar apartamento: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- UTILS ----------
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      head: "",
      email: "",
      phone: "",
      capacity: 2,
      price_per_night: 0.0,
      amenities: {},
      num_bedrooms: 1,
      num_bathrooms: 1,
      square_meters: null,
      is_active: true,
    });
    setNewImages([]);
    setPreviews([]);
    setImageAlts([]);
    setEditing(null);
  };

  const handleEdit = (apt) => {
    setEditing(apt.id);
    setFormData({
      name: apt.name,
      description: apt.description || "",
      head: apt.head || "",
      email: apt.email || "",
      phone: apt.phone || "",
      capacity: apt.capacity || 2,
      price_per_night: apt.price_per_night || 0,
      // Cargar amenities: mapear labels a object {label: true}, pero para simplicidad, asumir ids o reset a {}
      amenities: {}, // Nota: Para full match, necesitarías mapear strings a ids; aquí simplificado
      num_bedrooms: apt.num_bedrooms || 1,
      num_bathrooms: apt.num_bathrooms || 1,
      square_meters: apt.square_meters || null,
      is_active: apt.is_active,
    });
    // Pre-cargar previews si hay imágenes existentes (opcional, omitido por simplicidad)
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este apartamento?")) return;
    try {
      await apartmentsAPI.delete(id);
      setApartments((prev) => prev.filter((apt) => apt.id !== id));
    } catch (err) {
      console.error(err);
      const msg = err.message || err;
      alert("No se pudo eliminar: " + msg);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const fd = new FormData();
      fd.append("is_active", newStatus);
      const updated = await apartmentsAPI.update(id, fd);
      setApartments((prev) =>
        prev.map((apt) => (apt.id === id ? updated : apt))
      );
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado: " + (err.message || err));
    }
  };

  if (loading)
    return <div className="loading-spinner">Cargando apartamentos…</div>;

  return (
    <div className="management-section">
      <h2 className="section-title">Gestión de Apartamentos</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o descripción…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="form-container">
        <h3 className="form-title">
          {editing ? "Editar Apartamento" : "Crear Apartamento"}
        </h3>

        <input
          type="text"
          placeholder="Nombre del apartamento"
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
          type="text"
          placeholder="Jefe/Responsable"
          value={formData.head}
          onChange={(e) => setFormData({ ...formData, head: e.target.value })}
          className="form-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="form-input"
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-input"
        />
        <input
          type="number"
          placeholder="Capacidad (huéspedes)"
          value={formData.capacity}
          onChange={(e) =>
            setFormData({
              ...formData,
              capacity: parseInt(e.target.value) || 2,
            })
          }
          className="form-input"
          min="1"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Precio por noche"
          value={formData.price_per_night}
          onChange={(e) =>
            setFormData({
              ...formData,
              price_per_night: parseFloat(e.target.value) || 0,
            })
          }
          className="form-input"
          min="0"
          required
        />
        <input
          type="number"
          placeholder="Número de habitaciones"
          value={formData.num_bedrooms}
          onChange={(e) =>
            setFormData({
              ...formData,
              num_bedrooms: parseInt(e.target.value) || 1,
            })
          }
          className="form-input"
          min="1"
        />
        <input
          type="number"
          placeholder="Número de baños"
          value={formData.num_bathrooms}
          onChange={(e) =>
            setFormData({
              ...formData,
              num_bathrooms: parseInt(e.target.value) || 1,
            })
          }
          className="form-input"
          min="1"
        />
        <input
          type="number"
          step="0.01"
          placeholder="Metros cuadrados (ej: 80.5)"
          value={formData.square_meters || ""}
          onChange={(e) =>
            setFormData({
              ...formData,
              square_meters: parseFloat(e.target.value) || null,
            })
          }
          className="form-input"
        />
        <label className="form-checkbox">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) =>
              setFormData({ ...formData, is_active: e.target.checked })
            }
          />
          Activo
        </label>

        {/* SECCIÓN: Selección de Amenidades */}
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
                <input
                  type="text"
                  placeholder={`Alt para imagen ${idx + 1}`}
                  value={imageAlts[idx] || ""}
                  onChange={(e) => handleImageAltChange(idx, e.target.value)}
                  className="form-input"
                  style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}
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
        {filtered.map((apt) => (
          <div key={apt.id} className="apartment-card-admin">
            {apt.images?.[0] && (
              <img
                src={apt.images[0].url}
                alt={apt.images[0].alt}
                className="apartment-main-image"
              />
            )}

            <div className="apartment-card-content">
              <h3 className="card-title">{apt.name}</h3>
              <p className="card-description">{apt.description}</p>
              <p className="card-price">Precio: ${apt.price_per_night}/noche</p>
              <p className="card-meta">
                Capacidad: {apt.capacity} | {apt.num_bedrooms} hab. |{" "}
                {apt.num_bathrooms} baños | {apt.square_meters} m²
              </p>
              <span
                className={`status-badge ${
                  apt.is_active ? "available" : "occupied"
                }`}
              >
                {apt.is_active ? "Activo" : "Inactivo"}
              </span>
              {apt.head && <p className="card-head">Responsable: {apt.head}</p>}
              {apt.email && <p className="card-email">Email: {apt.email}</p>}
              {apt.phone && <p className="card-phone">Tel: {apt.phone}</p>}

              {apt.images && apt.images.length > 0 && (
                <div className="apartment-mini-gallery">
                  {apt.images.slice(0, 3).map((img, idx) => (
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
                  onClick={() => handleEdit(apt)}
                  className="btn btn-edit"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleStatusChange(apt.id, !apt.is_active)}
                  className="btn btn-toggle"
                >
                  {apt.is_active ? "Marcar inactivo" : "Marcar activo"}
                </button>
                <button
                  onClick={() => handleDelete(apt.id)}
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
        <p className="no-results">No se encontraron apartamentos.</p>
      )}

      {submitting && (
        <div className="overlay-loader">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
