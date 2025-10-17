import { Link } from "react-router-dom";
import { bookingsAPI } from "../../services/api";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const [stats, setStats] = useState({ totalBookings: 0 });

  useEffect(() => {
    bookingsAPI
      .getAll()
      .then((res) => setStats({ totalBookings: res.data.length }));
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Dashboard Admin</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold">Reservas Totales</h2>
            <p className="text-3xl">{stats.totalBookings}</p>
          </div>
          {/* Agrega más stats */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link
            to="/admin/rooms"
            className="bg-blue-500 text-white p-6 rounded-lg text-center"
          >
            Gestionar Habitaciones
          </Link>
          <Link
            to="/admin/bookings"
            className="bg-green-500 text-white p-6 rounded-lg text-center"
          >
            Gestionar Reservas
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
