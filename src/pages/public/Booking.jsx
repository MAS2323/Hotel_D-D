// src/pages/Booking.js (sin cambios mayores, solo import y uso)
import { motion } from "framer-motion";
import BookingForm from "../../components/forms/BookingForm";
import "./Booking.css";

const Booking = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="booking-section"
    >
      <div className="booking-container">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="booking-title"
        >
          Reserva tu Habitación o Apartamento
        </motion.h1>
        <BookingForm />
      </div>
    </motion.section>
  );
};

export default Booking;
