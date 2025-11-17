// src/components/forms/BookingForm.js (corregido: expresión JSX válida en el preview de precio)
import { useState, useEffect } from "react";
import { roomsAPI, apartmentsAPI, bookingsAPI } from "../../services/api";
import "./BookingForm.css";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    guest_name: "",
    guest_email: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    accommodation_type: "",
    accommodation_id: "",
  });
  const [accommodations, setAccommodations] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch rooms y apartments al montar el componente
  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const [roomsRes, apartmentsRes] = await Promise.all([
          roomsAPI.getAll(),
          apartmentsAPI.getAll(),
        ]);
        const rooms = Array.isArray(roomsRes) ? roomsRes : roomsRes.rooms || [];
        const apartments = Array.isArray(apartmentsRes)
          ? apartmentsRes
          : apartmentsRes.apartments || [];

        // Combinar con prefijo de tipo
        const combined = [
          ...rooms.map((room) => ({
            ...room,
            type: "room",
            displayName: `Habitación - ${room.name}`,
            price: room.price,
          })),
          ...apartments.map((apt) => ({
            ...apt,
            type: "apartment",
            displayName: `Apartamento - ${apt.name}`,
            price: apt.price_per_night,
          })),
        ];
        setAccommodations(
          combined.filter((acc) =>
            acc.type === "room" ? acc.is_available : acc.is_active
          )
        );
      } catch (err) {
        console.error("Error fetching accommodations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  // Calcular total al cambiar fechas o selección
  useEffect(() => {
    const { checkIn, checkOut, accommodation_id, accommodation_type } =
      formData;
    if (checkIn && checkOut && accommodation_id && accommodation_type) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24);
      if (nights > 0) {
        const selectedAcc = accommodations.find(
          (acc) =>
            acc.type === accommodation_type &&
            acc.id.toString() === accommodation_id
        );
        if (selectedAcc) {
          setTotalPrice(nights * selectedAcc.price);
        }
      }
    } else {
      setTotalPrice(0);
    }
  }, [formData, accommodations]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Construir payload con snake_case para coincidir con Pydantic schema
    const payload = {
      guest_name: formData.guest_name,
      guest_email: formData.guest_email,
      phone: formData.phone || null,
      check_in: formData.checkIn,
      check_out: formData.checkOut,
      accommodation_type: formData.accommodation_type,
      accommodation_id: parseInt(formData.accommodation_id, 10),
      total_price: totalPrice,
    };

    // Validación básica antes de enviar
    if (!payload.accommodation_id || isNaN(payload.accommodation_id)) {
      alert("Por favor, selecciona un alojamiento válido.");
      setSubmitting(false);
      return;
    }
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      alert("La fecha de check-out debe ser posterior a la de check-in.");
      setSubmitting(false);
      return;
    }

    try {
      await bookingsAPI.create(payload);
      alert("¡Reserva enviada! Te contactaremos pronto.");
      setFormData({
        guest_name: "",
        guest_email: "",
        phone: "",
        checkIn: "",
        checkOut: "",
        accommodation_type: "",
        accommodation_id: "",
      });
      setTotalPrice(0);
    } catch (err) {
      console.error(err);
      alert(
        "Error al enviar la reserva: " + (err.message || "Inténtalo de nuevo")
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-spinner">Cargando opciones...</div>;
  }

  // Helpers para preview
  const nights =
    formData.checkIn && formData.checkOut
      ? (new Date(formData.checkOut) - new Date(formData.checkIn)) /
        (1000 * 60 * 60 * 24)
      : 0;
  const selectedAcc = accommodations.find(
    (acc) =>
      acc.type === formData.accommodation_type &&
      acc.id.toString() === formData.accommodation_id
  );
  const pricePerNight = selectedAcc?.price || 0;

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="booking-form-group">
        <input
          type="text"
          name="guest_name"
          placeholder="Tu Nombre"
          value={formData.guest_name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="booking-form-group">
        <input
          type="email"
          name="guest_email"
          placeholder="Tu Email"
          value={formData.guest_email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="booking-form-group">
        <input
          type="tel"
          name="phone"
          placeholder="Tu Teléfono"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>
      <div className="booking-form-group">
        <input
          type="date"
          name="checkIn"
          placeholder="Check-in"
          value={formData.checkIn}
          onChange={handleChange}
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="booking-form-group">
        <input
          type="date"
          name="checkOut"
          placeholder="Check-out"
          value={formData.checkOut}
          onChange={handleChange}
          required
          min={formData.checkIn || new Date().toISOString().split("T")[0]}
        />
      </div>
      <div className="booking-form-group">
        <select
          name="accommodation_combined"
          value={
            formData.accommodation_id
              ? `${formData.accommodation_type}:${formData.accommodation_id}`
              : ""
          }
          onChange={(e) => {
            const value = e.target.value;
            if (value) {
              const [type, idStr] = value.split(":");
              setFormData({
                ...formData,
                accommodation_type: type,
                accommodation_id: idStr, // Solo el ID numérico como string
              });
            } else {
              setFormData({
                ...formData,
                accommodation_type: "",
                accommodation_id: "",
              });
            }
          }}
          required
        >
          <option value="">Seleccionar Alojamiento</option>
          {accommodations.map((acc) => (
            <option
              key={`${acc.type}:${acc.id}`}
              value={`${acc.type}:${acc.id}`}
            >
              {acc.displayName} ({acc.price} XAF/noche)
            </option>
          ))}
        </select>
      </div>
      {totalPrice > 0 && (
        <div className="booking-form-group">
          <p>
            Precio total estimado ({pricePerNight} XAF/noche x {nights} noches):{" "}
            <strong>{totalPrice} XAF</strong>
          </p>
        </div>
      )}
      <button
        type="submit"
        className="booking-submit-btn"
        disabled={submitting || !formData.accommodation_type}
      >
        {submitting ? "Enviando..." : "Reservar"}
      </button>
    </form>
  );
};

export default BookingForm;
