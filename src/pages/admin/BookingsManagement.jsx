// src/pages/admin/BookingsManagement.jsx
import React, { useEffect, useState } from "react";
import { bookingsAPI } from "../../services/api";
import "./BookingsManagement.css";

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: "",
    email: "",
    phone: "",
    room_id: "",
    check_in: "",
    check_out: "",
    total_price: "",
    status: "confirmed", // Opciones: confirmed, pending, cancelled
  });
  const [rooms, setRooms] = useState([]); // Para select de room_id
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---------- CARGAR BOOKINGS Y ROOMS ----------
  useEffect(() => {
    fetchBookings();
    fetchRooms();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getAll();
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await roomsAPI.getAll(); // Asume roomsAPI existe
      setRooms(Array.isArray(data) ? data : data.rooms || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- BÚSQUEDA ----------
  const filtered = bookings.filter(
    (b) =>
      b.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase())
  );

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const form = new FormData();
    form.append("guest_name", formData.guest_name);
    form.append("email", formData.email);
    form.append("phone", formData.phone);
    form.append("room_id", formData.room_id);
    form.append("check_in", formData.check_in);
    form.append("check_out", formData.check_out);
    form.append("total_price", formData.total_price);
    form.append("status", formData.status);

    try {
      if (editing) {
        await bookingsAPI.update(editing, form);
      } else {
        await bookingsAPI.create(form);
      }
      fetchBookings();
      resetForm();
      alert("✅ Reserva guardada exitosamente");
    } catch (err) {
      console.error("❌ Error:", err);
      const msg = err.message.includes("422")
        ? JSON.parse(err.message.split(": ")[1])?.detail?.[0]?.msg ||
          "Validación falló"
        : err.message;
      alert("Error al guardar reserva: " + msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- UTILS ----------
  const resetForm = () => {
    setFormData({
      guest_name: "",
      email: "",
      phone: "",
      room_id: "",
      check_in: "",
      check_out: "",
      total_price: "",
      status: "confirmed",
    });
    setEditing(null);
  };

  const handleEdit = (booking) => {
    setEditing(booking.id);
    setFormData({
      guest_name: booking.guest_name,
      email: booking.email,
      phone: booking.phone,
      room_id: booking.room_id,
      check_in: booking.check_in,
      check_out: booking.check_out,
      total_price: booking.total_price,
      status: booking.status,
    });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar esta reserva?")) return;
    try {
      await bookingsAPI.delete(id);
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("No se pudo eliminar: " + err.message);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const fd = new FormData();
      fd.append("status", newStatus);
      const updated = await bookingsAPI.update(id, fd);
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      console.error(err);
      alert("Error al cambiar estado: " + err.message);
    }
  };

  if (loading) return <div className="loading-spinner">Cargando reservas…</div>;

  return (
    <div className="management-section">
      <h2 className="section-title">Gestión de Reservas</h2>

      <input
        type="text"
        placeholder="Buscar por nombre o email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

      <form onSubmit={handleSubmit} className="form-container">
        <h3 className="form-title">
          {editing ? "Editar Reserva" : "Crear Reserva"}
        </h3>

        <input
          type="text"
          placeholder="Nombre del huésped"
          value={formData.guest_name}
          onChange={(e) =>
            setFormData({ ...formData, guest_name: e.target.value })
          }
          className="form-input"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="form-input"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-input"
          required
        />
        <select
          value={formData.room_id}
          onChange={(e) =>
            setFormData({ ...formData, room_id: e.target.value })
          }
          className="form-input"
          required
        >
          <option value="">Seleccionar habitación</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} ({room.price} XAF/noche)
            </option>
          ))}
        </select>
        <input
          type="date"
          placeholder="Check-in"
          value={formData.check_in}
          onChange={(e) =>
            setFormData({ ...formData, check_in: e.target.value })
          }
          className="form-input"
          required
        />
        <input
          type="date"
          placeholder="Check-out"
          value={formData.check_out}
          onChange={(e) =>
            setFormData({ ...formData, check_out: e.target.value })
          }
          className="form-input"
          required
        />
        <input
          type="number"
          placeholder="Precio total"
          value={formData.total_price}
          onChange={(e) =>
            setFormData({ ...formData, total_price: e.target.value })
          }
          className="form-input"
          required
        />
        <select
          value={formData.status}
          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          className="form-input"
          required
        >
          <option value="confirmed">Confirmada</option>
          <option value="pending">Pendiente</option>
          <option value="cancelled">Cancelada</option>
        </select>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Procesando…" : editing ? "Actualizar" : "Crear"}
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

      <div className="grid-container">
        {filtered.map((booking) => (
          <div key={booking.id} className="booking-card-admin">
            <div className="booking-header">
              <h3 className="card-title">{booking.guest_name}</h3>
              <span className={`status-badge ${booking.status}`}>
                {booking.status.toUpperCase()}
              </span>
            </div>
            <p className="card-meta">
              Email: {booking.email} | Tel: {booking.phone}
            </p>
            <p className="card-meta">
              Habitación ID: {booking.room_id} | Check-in: {booking.check_in} |
              Check-out: {booking.check_out}
            </p>
            <p className="card-price">Total: XAF {booking.total_price}</p>

            <div className="card-actions">
              <button
                onClick={() => handleEdit(booking)}
                className="btn btn-edit"
              >
                Editar
              </button>
              <button
                onClick={() =>
                  handleStatusChange(
                    booking.id,
                    booking.status === "confirmed" ? "pending" : "confirmed"
                  )
                }
                className="btn btn-toggle"
              >
                {booking.status === "confirmed" ? "Pendiente" : "Confirmar"}
              </button>
              <button
                onClick={() => handleDelete(booking.id)}
                className="btn btn-delete"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && !loading && (
        <p className="no-results">No se encontraron reservas.</p>
      )}

      {submitting && (
        <div className="overlay-loader">
          <div className="spinner" />
        </div>
      )}
    </div>
  );
}
