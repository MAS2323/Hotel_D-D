import React, { useEffect, useState } from "react";
import { servicesAPI } from "../../services/api";
import "./ServicesManagement.css";

export default function ServicesManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // id del servicio en edición
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
    try {
      let response;
      if (editing) {
        response = await servicesAPI.update(
          editing,
          formData.title,
          formData.desc,
          iconFile
        );
        setServices(services.map((s) => (s.id === editing ? response : s)));
      } else {
        response = await servicesAPI.create(
          formData.title,
          formData.desc,
          iconFile
        );
        setServices([...services, response]);
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar servicio:", err);
      alert("Error al guardar servicio");
    }
  };

  // Eliminar servicio
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar este servicio?")) return;
    try {
      await servicesAPI.delete(id);
      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Error al eliminar servicio:", err);
      alert("Error al eliminar servicio");
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
  };

  if (loading)
    return <div className="loading-spinner">Cargando servicios…</div>;

  return (
    <div className="services-management">
      <h2 className="section-title">Gestión de Servicios</h2>

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
        />
        <textarea
          placeholder="Descripción"
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          className="form-textarea"
          rows={3}
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setIconFile(e.target.files[0])}
          className="form-file"
        />
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

      {/* Lista de servicios */}
      <div className="grid-container">
        {filtered.map((service) => (
          <div key={service.id} className="service-card">
            {service.icon_url && (
              <img
                src={service.icon_url}
                alt={service.title}
                className="service-icon"
              />
            )}
            <h3 className="card-title">{service.title}</h3>
            <p className="card-desc">{service.desc}</p>
            <div className="card-actions">
              <button
                onClick={() => handleEdit(service)}
                className="btn btn-edit"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="btn btn-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="no-results">No se encontraron servicios.</p>
      )}
    </div>
  );
}
