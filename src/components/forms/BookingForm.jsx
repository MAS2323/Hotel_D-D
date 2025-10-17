// src/components/forms/BookingForm.js
import { useState } from "react";
import "./BookingForm.css";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("¡Reserva enviada! Te contactaremos pronto.");
    setFormData({
      name: "",
      email: "",
      checkIn: "",
      checkOut: "",
      roomType: "",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="booking-form">
      <div className="booking-form-group">
        <input
          type="text"
          name="name"
          placeholder="Tu Nombre"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="booking-form-group">
        <input
          type="email"
          name="email"
          placeholder="Tu Email"
          value={formData.email}
          onChange={handleChange}
          required
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
        />
      </div>
      <div className="booking-form-group">
        <select
          name="roomType"
          value={formData.roomType}
          onChange={handleChange}
          required
        >
          <option value="">Tipo de Habitación</option>
          <option value="cueva">Cueva del Dragón</option>
          <option value="torre">Torre del Mago</option>
          <option value="bosque">Bosque Encantado</option>
        </select>
      </div>
      <button type="submit" className="booking-submit-btn">
        Reservar
      </button>
    </form>
  );
};

export default BookingForm;
