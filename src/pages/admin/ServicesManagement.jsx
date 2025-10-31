import React, { useState, useEffect } from "react";
import axios from "axios";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/admin/users", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        alert("Error al cargar usuarios");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateRole = async (userId) => {
    try {
      await axios.put(
        `/api/admin/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setUsers(
        users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setEditingUser(null);
      setNewRole("");
    } catch (err) {
      console.error("Error updating role:", err);
      alert("Error al actualizar el rol");
    }
  };

  if (loading)
    return <div className="loading-spinner">Cargando usuarios...</div>;

  return (
    <div className="management-section">
      <h2 className="section-title">Gestión de Usuarios</h2>
      <input
        type="text"
        placeholder="Buscar por username o email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {editingUser === user.id ? (
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                      className="role-select"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  ) : (
                    <span
                      className={`role-badge ${
                        user.role === "admin" ? "admin-role" : "user-role"
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </td>
                <td>
                  {editingUser === user.id ? (
                    <>
                      <button
                        onClick={() => updateRole(user.id)}
                        className="btn btn-save"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setEditingUser(null);
                          setNewRole("");
                        }}
                        className="btn btn-cancel"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingUser(user.id);
                        setNewRole(user.role);
                      }}
                      className="btn btn-edit"
                    >
                      Editar Rol
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {filteredUsers.length === 0 && (
        <p className="no-results">No se encontraron usuarios.</p>
      )}
    </div>
  );
};

export default UserManagement;
