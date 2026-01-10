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
    } else {
      setPreview(null);
    }
  }, [file]);

  // Crear o actualizar
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🚨 VALIDACIÓN CRÍTICA: Verificar archivo antes de enviar
    if (!file && !editing) {
      alert("❌ Debes seleccionar una imagen para subir");
      return;
    }

    if (file && !(file instanceof File)) {
      console.error("❌ 'file' no es un objeto File válido:", file);
      alert("Error: El archivo seleccionado no es válido");
      return;
    }

    if (file && file.size === 0) {
      alert("❌ El archivo está vacío (0 bytes)");
      return;
    }

    setOperationLoading(true);

    try {
      // 🚨 LOG PARA DEBUG
      console.log("=== ENVIANDO A API ===");
      console.log("alt:", formData.alt);
      console.log("desc:", formData.desc);
      console.log("category:", activeTab);
      console.log("file:", file?.name, `${file?.size} bytes`, file?.type);
      console.log("editing:", editing || "Nuevo");

      let response;
      if (editing) {
        response = await currentAPI.update(
          editing,
          formData.alt,
          formData.desc,
          file,
          activeTab
        );
        setImages(images.map((img) => (img.id === editing ? response : img)));
      } else {
        response = await currentAPI.create(
          formData.alt,
          formData.desc,
          file,
          activeTab
        );
        setImages([...images, response]);
      }

      console.log("✅ ÉXITO:", response);
      resetForm();
    } catch (err) {
      console.error("❌ ERROR AL GUARDAR:", err);
      alert(`Error al guardar imagen: ${err.message}`);
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
      console.log("✅ Imagen eliminada:", id);
    } catch (err) {
      console.error("❌ ERROR AL ELIMINAR:", err);
      alert("Error al eliminar imagen");
    } finally {
      setOperationLoading(false);
    }
  };

  // Editar
  const handleEdit = (image) => {
    if (image.category !== activeTab) {
      setActiveTab(image.category);
      return;
    }
    setEditing(image.id);
    setFormData({ alt: image.alt, desc: image.desc });
    setPreview(image.url);
    setFile(null); // Importante: no enviar archivo en edición a menos que se seleccione uno nuevo
  };

  // Reset
  const resetForm = () => {
    setFormData({ alt: "", desc: "" });
    setFile(null);
    setPreview(null);
    setEditing(null);
    // Resetear el input file
    document.querySelector('input[type="file"]').value = "";
  };

  if (loading) {
    return <div className="loading-spinner">Cargando {activeTab}…</div>;
  }

  const getTitle = () =>
    activeTab === "galeria" ? "Gestión de Galería" : "Gestión de Hero";

  return (
    <div className="gallery-management">
      <h2 className="gallery-title">{getTitle()}</h2>

      {/* Tabs */}
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

      {/* Loader global */}
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
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            if (selectedFile) {
              console.log(
                "✅ Archivo seleccionado:",
                selectedFile.name,
                `${selectedFile.size} bytes`
              );
              setFile(selectedFile);
            } else {
              console.log("❌ No se seleccionó archivo");
              setFile(null);
            }
          }}
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
