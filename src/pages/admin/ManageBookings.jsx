import { useState, useEffect } from "react";
import { bookingsAPI } from "../../services/api";

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    bookingsAPI.getAll().then((res) => setBookings(res.data));
  }, []);

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Gestionar Reservas</h1>
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Nombre</th>
              <th className="p-2">Email</th>
              <th className="p-2">Fechas</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-2">{booking.name}</td>
                <td className="p-2">{booking.email}</td>
                <td className="p-2">{booking.dates}</td>
                <td className="p-2">
                  <button className="bg-blue-500 text-white px-2 py-1 rounded mr-2">
                    Editar
                  </button>
                  <button className="bg-red-500 text-white px-2 py-1 rounded">
                    Cancelar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ManageBookings;
