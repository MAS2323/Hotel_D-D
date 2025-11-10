import React, { useEffect, useState } from "react";
import { galleryAPI } from "../../services/api";
import "./GalleryManagement.css";

export default function GalleryManagement() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [operationLoading, setOperationLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({ alt: "", desc: "" });
  const [files, setFiles] = useState([]); // Cambiado: array para múltiples
  const [previews, setPreviews] = useState([]); // Array para previews

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

  // Previews múltiples
  useEffect(() => {
    if (files.length > 0) {
      const objectUrls = files.map((file) => URL.createObjectURL(file));
      setPreviews(objectUrls);
      return () => objectUrls.forEach((url) => URL.revokeObjectURL(url));
    } else {
      setPreviews([]);
    }
  }, [files]);

  // Crear (batch) o actualizar (single)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setOperationLoading(true);
    try {
      let response;
      if (editing) {
        // Single update (mantiene lógica original)
        response = await galleryAPI.update(
          editing,
          formData.alt,
          formData.desc,
          files[0] || null // Toma el primero si hay
        );
        setImages(images.map((img) => (img.id === editing ? response : img)));
      } else {
        // Batch create: múltiples archivos con mismo alt/desc
        if (files.length === 0) {
          alert("Selecciona al menos una imagen");
          return;
        }
        response = await galleryAPI.create(formData.alt, formData.desc, files); // Envía array de files
        setImages([...images, ...response]); // Agrega todas las nuevas
      }
      resetForm();
    } catch (err) {
      console.error("Error al guardar imágenes:", err);
      alert("Error al guardar imágenes");
    } finally {
      setOperationLoading(false);
    }
  };

  // Eliminar (sin cambios)
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

  // Editar (single, sin cambios)
  const handleEdit = (image) => {
    setEditing(image.id);
    setFormData({ alt: image.alt, desc: image.desc });
    setFiles([]); // Limpia múltiples para edit
    setPreviews([image.url]); // Preview single
  };

  // Reset
  const resetForm = () => {
    setFormData({ alt: "", desc: "" });
    setFiles([]);
    setPreviews([]);
    setEditing(null);
  };

  if (loading) return <div className="loading-spinner">Cargando galería…</div>;

  return (
    <div className="gallery-management">
      <h2 className="gallery-title">Gestión de Galería</h2>

      {/* Loader global */}
      {operationLoading && (
        <div className="global-loader">
          <div className="circular-progress">
            <div className="spinner"></div>
            <p>Procesando {editing ? "edición" : "subida"}...</p>
          </div>
        </div>
      )}

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="gallery-form">
        <h3 className="form-title">
          {editing ? "Editar Imagen" : "Subir Imágenes (Múltiples)"}
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
          multiple // ✅ Nuevo: permite múltiples
          onChange={(e) => setFiles(Array.from(e.target.files))} // Array de files
          className="form-file"
          disabled={operationLoading}
        />
        {previews.length > 0 && (
          <div className="preview-container">
            <p>Preview:</p>
            <div className="previews-grid">
              {previews.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="preview-image"
                />
              ))}
            </div>
            <small>{previews.length} imagen(es) seleccionada(s)</small>
          </div>
        )}
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={operationLoading || files.length === 0}
          >
            {editing ? "Actualizar" : `Subir ${files.length || 0} imagen(es)`}
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
          </div>
        ))}
      </div>

      {images.length === 0 && !operationLoading && (
        <p className="no-results">No hay imágenes en la galería.</p>
      )}
    </div>
  );
}
