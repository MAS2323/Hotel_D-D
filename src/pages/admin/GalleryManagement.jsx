import React, { useEffect, useState } from "react";
import { galleryAPI } from "../../services/api";
import "./GalleryManagement.css";

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ alt: "", desc: "" });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hoveredImage, setHoveredImage] = useState(null); // Nuevo estado para controlar hover

  // GET imágenes
  useEffect(() => {
    galleryAPI
      .getAll()
      .then((data) => {
        const list = Array.isArray(data) ? data : data.images;
        setImages(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Error al cargar galería:", err);
        alert("No se pudieron cargar las imágenes");
      })
      .finally(() => setLoading(false));
  }, []);

  // Preview de imagen
  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  // Manejar hover
  const handleMouseEnter = (imageId) => {
    setHoveredImage(imageId);
  };

  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    try {
      let response;
      if (editing) {
        response = await galleryAPI.update(
          editing,
          formData.alt,
          formData.desc,
          file
        );
        setImages(images.map((img) => (img.id === editing ? response : img)));
      } else {
        response = await galleryAPI.create(formData.alt, formData.desc, file);
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
      await galleryAPI.delete(id);
      setImages(images.filter((img) => img.id !== id));
    } catch (err) {
      console.error("Error al eliminar imagen:", err);
      alert("Error al eliminar imagen");
    } finally {
      setOperationLoading(false);
    }
  };

  // Editar
  const handleEdit = (image) => {
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

  if (loading) return <div className="loading-spinner">Cargando galería…</div>;

  return (
    <div className="gallery-management">
      <h2 className="gallery-title">Gestión de Galería</h2>

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
          <div
            key={image.id}
            className="gallery-item-admin"
            onMouseEnter={() => handleMouseEnter(image.id)}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="gallery-image-admin"
            />

            {/* Overlay que solo se muestra al hacer hover */}
            {hoveredImage === image.id && (
              <div className="gallery-overlay">
                <h4 className="gallery-alt">{image.alt}</h4>
                <p className="gallery-desc">{image.desc}</p>
                <div className="gallery-actions">
                  <button
                    onClick={() => handleEdit(image)}
                    className="btn btn-edit"
                    disabled={operationLoading}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="btn btn-delete"
                    disabled={operationLoading}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {images.length === 0 && !operationLoading && (
        <p className="no-results">No hay imágenes en la galería.</p>
      )}
    </div>
  );
}
