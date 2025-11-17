import React, { useEffect, useState } from "react";
import { servicesAPI } from "../../services/api";
import "./ServicesManagement.css";

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ title: "", desc: "" });
  const [iconFile, setIconFile] = useState(null);
  const [search, setSearch] = useState("");

  // GET todos los servicios
  useEffect(() => {
    servicesAPI
      .getAdminAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.services;
        setServices(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Error al cargar servicios:", err);
        alert("No se pudieron cargar los servicios");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtro rápido
  const filtered = services.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  // Crear o actualizar servicio
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true); // Inicia loader

    // ← NUEVO: Validar archivo requerido
    if (!iconFile && !editing) {
      alert("Por favor, selecciona un icono para el servicio");
      setOperationLoading(false);
      return;
    }

    try {
      let response;
      if (editing) {
        response = await servicesAPI.update(
          editing,
          formData.title,
          formData.desc,
          iconFile // Puede ser null si no se cambia
        );
        setServices(services.map((s) => (s.id === editing ? response : s)));
      } else {
        response = await servicesAPI.create(
          formData.title,
          formData.desc,
          iconFile // Requerido para nuevo
        );
        setServices([...services, response]);
      }
      resetForm();
      alert("✅ Servicio guardado exitosamente");
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      const msg = err.message.includes("422")
        ? JSON.parse(err.message.split(": ")[1])?.detail?.[0]?.msg ||
          "Validación falló"
        : err.message;
      alert("Error al guardar servicio: " + msg);
    } finally {
      setOperationLoading(false); // Detiene loader
    }
  };

  // Eliminar servicio
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    setOperationLoading(true); // Inicia loader
    try {
      await servicesAPI.delete(id);
      setServices(services.filter((s) => s.id !== id));
      alert("✅ Servicio eliminado exitosamente");
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      alert("Error al eliminar servicio: " + (err.message || err));
    } finally {
      setOperationLoading(false); // Detiene loader
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setFormData({ title: "", desc: "" });
    setIconFile(null);
    setEditing(null);
  };

  // Cargar datos al editar
  const handleEdit = (service) => {
    setEditing(service.id);
    setFormData({ title: service.title, desc: service.desc });
    setIconFile(null); // Reset file para nuevo upload si se cambia
  };

  if (loading)
    return <div className="loading-spinner">Cargando servicios…</div>;

  return (
    <div className="services-management">
      <h2 className="section-title">Gestión de Servicios</h2>

      {/* Loader global para operaciones */}
      {operationLoading && (
        <div className="global-loader">
          <div className="circular-progress">
            <div className="spinner"></div>
            <p>Procesando...</p>
          </div>
        </div>
      )}

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por título…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="form-container">
        <h3 className="form-title">
          {editing ? "Editar Servicio" : "Crear Servicio"}
        </h3>
        <input
          type="text"
          placeholder="Título"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="form-input"
          required
          disabled={operationLoading} // Deshabilita durante loader
        />
        <textarea
          placeholder="Descripción"
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          className="form-textarea"
          rows={3}
          required
          disabled={operationLoading} // Deshabilita durante loader
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIconFile(e.target.files[0])}
          className="form-file"
          disabled={operationLoading} // Deshabilita durante loader
          required={!editing} // Requerido solo para nuevo (edición opcional)
        />
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={
              operationLoading ||
              !formData.title ||
              !formData.desc ||
              (!iconFile && !editing)
            }
          >
            {editing ? "Actualizar" : "Crear"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary"
            disabled={operationLoading}
          >
            Cancelar
          </button>
        </div>
      </form>

      {/* Lista de servicios */}
      <div className="grid-container">
        {filtered.map((service) => (
          <div key={service.id} className="service-card">
            {service.icon_url ? (
              <img
                src={service.icon_url}
                alt={service.title}
                className="service-icon"
              />
            ) : (
              <div className="service-icon-placeholder">🏰</div>
            )}
            <h3 className="card-title">{service.title}</h3>
            <p className="card-desc">{service.desc}</p>
            <div className="card-actions">
              <button
                onClick={() => handleEdit(service)}
                className="btn btn-edit"
                disabled={operationLoading}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="btn btn-delete"
                disabled={operationLoading}
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !operationLoading && (
        <p className="no-results">No se encontraron servicios.</p>
      )}
    </div>
  );
}
