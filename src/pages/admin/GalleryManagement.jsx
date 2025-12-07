// src/components/admin/GalleryManagement.jsx (actualizado: estructura de cards sin overlay, botones siempre visibles en la parte inferior)
import React, { useEffect, useState } from "react";
import { galleryAPI, heroAPI } from "../../services/api";
import "./GalleryManagement.css";

export default function GalleryManagement() {
  const [activeTab, setActiveTab] = useState("galeria");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ alt: "", desc: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // Determinar API actual basada en tab
  const currentAPI = activeTab === "galeria" ? galleryAPI : heroAPI;

  // GET imágenes por categoría activa
  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true);
        const data = await currentAPI.getAll();
        const list = Array.isArray(data) ? data : data.images || data || [];
        setImages(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error(`Error al cargar ${activeTab}:`, err);
        alert(`No se pudieron cargar las imágenes de ${activeTab}`);
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [activeTab, currentAPI]);

  // Preview de imagen
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    try {
      let response;
      if (editing) {
        // Para update, pasa la categoría actual del tab (mantiene en misma categoría)
        response = await currentAPI.update(
          editing,
          formData.alt,
          formData.desc,
          file,
          activeTab
        );
        setImages(images.map((img) => (img.id === editing ? response : img)));
      } else {
        // Para create, usa categoría del tab
        response = await currentAPI.create(
          formData.alt,
          formData.desc,
          file,
          activeTab
        );
        setImages([...images, response]);
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar imagen:", err);
      alert("Error al guardar imagen");
    } finally {
      setOperationLoading(false);
    }
  };

  // Eliminar
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta imagen?")) return;
    setOperationLoading(true);
    try {
      await currentAPI.delete(id);
      setImages(images.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
      alert("Error al eliminar imagen");
    } finally {
      setOperationLoading(false);
    }
  };

  // Editar: Cambia tab si la imagen es de otra categoría
  const handleEdit = (image) => {
    if (image.category !== activeTab) {
      setActiveTab(image.category);
      // Re-render usará el nuevo currentAPI
      return; // Espera al nuevo fetch antes de editar
    }
    setEditing(image.id);
    setFormData({ alt: image.alt, desc: image.desc });
    setPreview(image.url);
    setFile(null);
  };

  // Reset
  const resetForm = () => {
    setFormData({ alt: "", desc: "" });
    setFile(null);
    setPreview(null);
    setEditing(null);
  };

  if (loading)
    return <div className="loading-spinner">Cargando {activeTab}…</div>;

  const getTitle = () =>
    activeTab === "galeria" ? "Gestión de Galería" : "Gestión de Hero";

  return (
    <div className="gallery-management">
      <h2 className="gallery-title">{getTitle()}</h2>
      {/* Tabs para categorías */}
      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "galeria" ? "active" : ""}`}
          onClick={() => setActiveTab("galeria")}
          disabled={operationLoading}
        >
          Galería
        </button>
        <button
          className={`tab-btn ${activeTab === "hero" ? "active" : ""}`}
          onClick={() => setActiveTab("hero")}
          disabled={operationLoading}
        >
          Hero
        </button>
      </div>
      {/* Loader global para operaciones */}
      {operationLoading && (
        <div className="global-loader">
          <div className="circular-progress">
            <div className="spinner"></div>
            <p>Procesando...</p>
          </div>
        </div>
      )}
      {/* Formulario */}
      <form onSubmit={handleSubmit} className="gallery-form">
        <h3 className="form-title">
          {editing ? "Editar Imagen" : "Subir Imagen"}
        </h3>
        <input
          type="text"
          placeholder="Texto alternativo (alt)"
          value={formData.alt}
          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
          className="form-input"
          required
          disabled={operationLoading}
        />
        <textarea
          placeholder="Descripción"
          value={formData.desc}
          onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
          className="form-textarea"
          rows={3}
          required
          disabled={operationLoading}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="form-file"
          disabled={operationLoading}
        />
        {preview && (
          <div className="preview-container">
            <img src={preview} alt="Preview" className="preview-image" />
          </div>
        )}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={operationLoading}
          >
            {editing ? "Actualizar" : "Subir"}
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
      {/* Galería */}
      <div className="gallery-grid-admin">
        {images.map((image) => (
          <div key={image.id} className="gallery-item-admin">
            <img
              src={image.url}
              alt={image.alt}
              className="gallery-image-admin"
            />
            <div className="gallery-content">
              <h4 className="gallery-alt">{image.alt}</h4>
              <div className="gallery-actions">
                <button
                  onClick={() => handleEdit(image)}
                  className="btn btn-edit"
                  title="Editar imagen"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(image.id)}
                  className="btn btn-delete"
                  title="Eliminar imagen"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {images.length === 0 && !operationLoading && (
        <p className="no-results">
          No hay imágenes en {activeTab}. Sube la primera arriba.
        </p>
      )}
    </div>
  );
}
