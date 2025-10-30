// src/components/admin/AdminDashboard.js
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import UserManagement from "./UserManagement";
import ServicesManagement from "./ServicesManagement";

// Sidebar común
const AdminSidebar = () => (
  <div className="admin-sidebar bg-gray-800 text-white p-4 w-64 h-screen fixed">
    <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
    <ul className="space-y-2">
      <li>
        <Link to="/admin/users" className="block p-2 hover:bg-gray-700 rounded">
          Gestión de Usuarios
        </Link>
      </li>
      <li>
        <Link
          to="/admin/services"
          className="block p-2 hover:bg-gray-700 rounded"
        >
          Gestión de Servicios
        </Link>
      </li>
      {/* Agrega más: Rooms, Bookings, etc. */}
    </ul>
  </div>
);

// Dashboard principal (envuelve sub-routes)
const AdminDashboard = () => (
  <div className="flex">
    <AdminSidebar />
    <div className="ml-64 p-8">
      <Routes>
        <Route path="/users" element={<UserManagement />} />
        <Route path="/services" element={<ServicesManagement />} />
        <Route path="/" element={<h1>Bienvenido al Admin</h1>} />
      </Routes>
    </div>
  </div>
);

// Gestión de Usuarios (listar, editar roles)
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = "none";
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    axios
      .get("/api/admin/users", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }, // Asume token en localStorage
      })
      .then((res) => setUsers(res.data));
  }, []);

  const updateRole = async (userId) => {
    await axios.put(
      `/api/admin/users/${userId}/role`,
      { role: newRole },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    setEditingUser("none");
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Usuarios</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">ID</th>
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.id}</td>
              <td className="border p-2">{user.username}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {editingUser === user.id ? (
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              <td className="border p-2">
                {editingUser === user.id ? (
                  <button
                    onClick={() => updateRole(user.id)}
                    className="bg-green-500 text-white px-2 py-1 rounded mr-1"
                  >
                    Guardar
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setEditingUser(user.id);
                      setNewRole(user.role);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Editar Role
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Gestión de Servicios (CRUD con upload icono)
const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = "none";
  const [formData, setFormData] = useState({ title: "", desc: "" });
  const [newFile, setNewFile] = useState(null);

  useEffect(() => {
    axios.get("/api/services").then((res) => setServices(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("desc", formData.desc);
    if (newFile) formDataToSend.append("icon_file", newFile);

    const response = await axios.post("/api/admin/services", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setServices([...services, response.data]);
    setFormData({ title: "", desc: "" });
    setNewFile(null);
  };

  const handleEdit = (service) => {
    setEditingService(service.id);
    setFormData({ title: service.title, desc: service.desc });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("desc", formData.desc);
    if (newFile) formDataToSend.append("icon_file", newFile);

    const response = await axios.put(
      `/api/admin/services/${editingService}`,
      formDataToSend,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    setServices(
      services.map((s) => (s.id === editingService ? response.data : s))
    );
    setEditingService("none");
  };

  const handleDelete = async (id) => {
    if (confirm("¿Eliminar servicio?")) {
      await axios.delete(`/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setServices(services.filter((s) => s.id !== id));
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Servicios</h2>

      {/* Form Crear/Editar */}
      {editingService === "none" ? (
        <form onSubmit={handleCreate} className="mb-8 p-4 bg-gray-100 rounded">
          <h3 className="mb-2">Crear Servicio</h3>
          <input
            type="text"
            placeholder="Título"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="block w-full p-2 border rounded mb-2"
          />
          <textarea
            placeholder="Descripción"
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            className="block w-full p-2 border rounded mb-2"
          />
          <input
            type="file"
            onChange={(e) => setNewFile(e.target.files[0])}
            className="block w-full mb-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">
            Crear
          </button>
        </form>
      ) : (
        <form onSubmit={handleUpdate} className="mb-8 p-4 bg-gray-100 rounded">
          <h3 className="mb-2">Editar Servicio</h3>
          {/* Similar inputs as create, with edit data */}
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Actualizar
          </button>
          <button
            type="button"
            onClick={() => setEditingService("none")}
            className="bg-gray-500 text-white p-2 rounded"
          >
            Cancelar
          </button>
        </form>
      )}

      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <div key={service.id} className="p-4 bg-white rounded shadow">
            <img
              src={service.icon_url}
              alt={service.title}
              className="w-20 h-20 mb-2"
            />
            <h3 className="font-bold">{service.title}</h3>
            <p>{service.desc}</p>
            <button
              onClick={() => handleEdit(service)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(service.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
