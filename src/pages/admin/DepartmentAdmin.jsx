// components/admin/DepartmentAdmin.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DepartmentAdmin.css"; // CSS opcional

const DepartmentAdmin = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head: "",
    email: "",
    phone: "",
    is_active: true,
  });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [imageAlts, setImageAlts] = useState([]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/departments");
      setDepartments(response.data); // Ajuste: response.data es directamente la lista
    } catch (err) {
      setError(err);
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
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("head", formData.head);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("is_active", formData.is_active);

      // Agregar metadatos de imágenes
      imageFiles.forEach((file, index) => {
        formDataToSend.append("files", file);
        formDataToSend.append(`alt_list`, imageAlts[index] || ""); // alt_list como array de strings
      });

      if (editingId) {
        await axios.put(`/api/departments/${editingId}`, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await axios.post("/api/departments", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchDepartments();
      resetForm();
      setShowModal(false);
    } catch (err) {
      setError(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      head: "",
      email: "",
      phone: "",
      is_active: true,
    });
    setEditingId(null);
    setImageFiles([]);
    setImageAlts([]);
  };

  const handleEdit = (dept) => {
    setFormData({
      name: dept.name,
      description: dept.description,
      head: dept.head,
      email: dept.email,
      phone: dept.phone,
      is_active: dept.is_active,
    });
    setEditingId(dept.id); // Ajuste: usar id en lugar de _id
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro?")) {
      try {
        await axios.delete(`/api/departments/${id}`); // Ajuste: id numérico
        fetchDepartments();
      } catch (err) {
        setError(err);
      }
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  return (
    <section className="department-admin">
      <h2>Administrar Departamentos</h2>
      <button
        onClick={() => {
          setShowModal(true);
          resetForm();
        }}
        className="add-btn"
      >
        Agregar Departamento
      </button>

      <table className="departments-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Jefe</th>
            <th>Email</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {departments.map((dept) => (
            <tr key={dept.id}>
              {" "}
              {/* Ajuste: usar id en lugar de _id */}
              <td>{dept.name}</td>
              <td>{dept.description.substring(0, 50)}...</td>
              <td>{dept.head}</td>
              <td>{dept.email}</td>
              <td>{dept.is_active ? "Activo" : "Inactivo"}</td>
              <td>
                <button onClick={() => handleEdit(dept)}>Editar</button>
                <button onClick={() => handleDelete(dept.id)}>
                  Eliminar
                </button>{" "}
                {/* Ajuste: dept.id */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingId ? "Editar" : "Agregar"} Departamento</h3>
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

export default DepartmentAdmin;
