import React, { useEffect, useState } from "react";
import { usersAPI } from "../../services/api";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(null); // id del usuario en edición
  const [newRole, setNewRole] = useState(""); // rol temporal

  // GET todos los usuarios
  useEffect(() => {
    usersAPI
      .getAdminUsers(0, 100, {
        token: localStorage.getItem("token"),
        db: "production",
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data.users;
        setUsers(Array.isArray(list) ? list : []);
      })
      .catch((err) => {
        console.error("Error al cargar usuarios:", err);
        alert("No se pudieron cargar los usuarios");
      })
      .finally(() => setLoading(false));
  }, []);

  // Filtro rápido
  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Actualizar rol
  const updateRole = (userId) => {
    usersAPI
      .updateRole(userId, newRole)
      .then(() => {
        setUsers(
          users.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
        );
        setEditing(null);
        setNewRole("");
      })
      .catch((err) => {
        console.error("Error al actualizar rol:", err);
        alert("Error al actualizar rol");
      });
  };

  if (loading) return <div className="loading-spinner">Cargando usuarios…</div>;

  return (
    <div className="management-section">
      <h2 className="section-title">Gestión de Usuarios</h2>

      {/* Buscador */}
      <input
        type="text"
        placeholder="Buscar por username o email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      {/* Tabla */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  {editing === user.id ? (
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
                  {editing === user.id ? (
                    <>
                      <button
                        className="btn btn-save"
                        onClick={() => updateRole(user.id)}
                      >
                        Guardar
                      </button>
                      <button
                        className="btn btn-cancel"
                        onClick={() => {
                          setEditing(null);
                          setNewRole("");
                        }}
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-edit"
                      onClick={() => {
                        setEditing(user.id);
                        setNewRole(user.role);
                      }}
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

      {filtered.length === 0 && (
        <p className="no-results">No se encontraron usuarios.</p>
      )}
    </div>
  );
}
