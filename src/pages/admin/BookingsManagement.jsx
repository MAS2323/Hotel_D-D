// src/pages/admin/BookingsManagement.jsx (ajustado para manejar rooms y apartments, búsqueda mejorada, y mostrar nombres de acc)
import React, { useEffect, useState } from "react";
import { bookingsAPI, roomsAPI, apartmentsAPI } from "../../services/api"; // Agrega apartmentsAPI
import "./BookingsManagement.css";

export default function BookingsManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    phone: "",
    accommodation_type: "room", // Default
    accommodation_id: "",
    check_in: "",
    check_out: "",
    total_price: "",
    status: "confirmed",
  });
  const [rooms, setRooms] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [search, setSearch] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---------- CARGAR BOOKINGS, ROOMS Y APARTMENTS ----------
  useEffect(() => {
    fetchBookings();
    fetchRooms();
    fetchApartments();
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await bookingsAPI.getAll();
      // Enriquecer bookings con nombres de accommodations (fetch si no vienen en API)
      const enriched = await Promise.all(
        (Array.isArray(data) ? data : data.bookings || []).map(async (b) => {
          let accName = "";
          if (b.accommodation_type === "room") {
            const room = await roomsAPI
              .getById(b.accommodation_id)
              .catch(() => ({}));
            accName = room.name || `Room ID: ${b.accommodation_id}`;
          } else if (b.accommodation_type === "apartment") {
            const apt = await apartmentsAPI
              .getById(b.accommodation_id)
              .catch(() => ({}));
            accName = apt.name || `Apt ID: ${b.accommodation_id}`;
          }
          return { ...b, accommodation_name: accName };
        })
      );
      setBookings(enriched);
    } catch (err) {
      console.error(err);
      alert("No se pudieron cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const fetchRooms = async () => {
    try {
      const data = await roomsAPI.getAll();
      setRooms(Array.isArray(data) ? data : data.rooms || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchApartments = async () => {
    try {
      const data = await apartmentsAPI.getAll(); // Asume apartmentsAPI existe
      setApartments(Array.isArray(data) ? data : data.apartments || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ---------- BÚSQUEDA (mejorada para incluir acc name) ----------
  const filtered = bookings.filter(
    (b) =>
      b.guest_name.toLowerCase().includes(search.toLowerCase()) ||
      b.guest_email.toLowerCase().includes(search.toLowerCase()) ||
      (b.accommodation_name || "").toLowerCase().includes(search.toLowerCase())
  );

  // ---------- SUBMIT (con cálculo si es nuevo) ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    let payload = { ...formData };
    if (!editing) {
      // Calcular total si es creación
      const checkInDate = new Date(formData.check_in);
      const checkOutDate = new Date(formData.check_out);
      const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      let price = 0;
      if (formData.accommodation_type === "room") {
        const room = rooms.find(
          (r) => r.id === parseInt(formData.accommodation_id)
        );
        price = room ? room.price : 0;
      } else {
        const apt = apartments.find(
          (a) => a.id === parseInt(formData.accommodation_id)
        );
        price = apt ? apt.price_per_night : 0;
      }
      payload.total_price = nights * price;
    }

    try {
      if (editing) {
        await bookingsAPI.update(editing, payload);
      } else {
        await bookingsAPI.create(payload);
      }
      fetchBookings(); // Refetch para enriquecer
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
      guest_email: "",
      phone: "",
      accommodation_type: "room",
      accommodation_id: "",
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
      guest_email: booking.guest_email,
      phone: booking.phone,
      accommodation_type: booking.accommodation_type,
      accommodation_id: booking.accommodation_id,
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
      const payload = { status: newStatus };
      const updated = await bookingsAPI.update(id, payload);
      // Refetch para consistencia, o update local
      fetchBookings();
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
        placeholder="Buscar por nombre, email o alojamiento…"
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
          value={formData.guest_email}
          onChange={(e) =>
            setFormData({ ...formData, guest_email: e.target.value })
          }
          className="form-input"
          required
        />
        <input
          type="tel"
          placeholder="Teléfono"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="form-input"
        />

        {/* Select para tipo */}
        <select
          value={formData.accommodation_type}
          onChange={(e) => {
            setFormData({
              ...formData,
              accommodation_type: e.target.value,
              accommodation_id: "",
            });
          }}
          className="form-input"
          required
        >
          <option value="room">Habitación</option>
          <option value="apartment">Apartamento</option>
        </select>

        {/* Select para ID basado en tipo */}
        <select
          value={formData.accommodation_id}
          onChange={(e) =>
            setFormData({ ...formData, accommodation_id: e.target.value })
          }
          className="form-input"
          required
        >
          <option value="">
            Seleccionar{" "}
            {formData.accommodation_type === "room"
              ? "habitación"
              : "apartamento"}
          </option>
          {formData.accommodation_type === "room" &&
            rooms.map((room) => (
              <option key={room.id} value={room.id}>
                {room.name} ({room.price} XAF/noche)
              </option>
            ))}
          {formData.accommodation_type === "apartment" &&
            apartments.map((apt) => (
              <option key={apt.id} value={apt.id}>
                {apt.name} ({apt.price_per_night} XAF/noche)
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
              Email: {booking.guest_email} | Tel: {booking.phone}
            </p>
            <p className="card-meta">
              Alojamiento: {booking.accommodation_name} (
              {booking.accommodation_type}) | Check-in: {booking.check_in} |
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
