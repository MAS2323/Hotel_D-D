import { useState, useEffect } from "react";
import { roomsAPI } from "../../services/api";
import RoomCard from "../../components/ui/RoomCard"; // Reutiliza el componente UI

const ManageRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [newRoom, setNewRoom] = useState({
    name: "",
    description: "",
    price: 0,
  });

  useEffect(() => {
    roomsAPI.getAll().then((res) => setRooms(res.data));
  }, []);

  const handleCreate = () => {
    roomsAPI.create(newRoom).then((res) => setRooms([...rooms, res.data]));
  };

  const handleDelete = (id) => {
    roomsAPI.delete(id).then(() => setRooms(rooms.filter((r) => r.id !== id)));
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Gestionar Habitaciones</h1>
        {/* Formulario create */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
          className="bg-white p-6 rounded-lg shadow-md mb-8 space-y-4"
        >
          <input
            placeholder="Nombre"
            value={newRoom.name}
            onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <textarea
            placeholder="Descripción"
            value={newRoom.description}
            onChange={(e) =>
              setNewRoom({ ...newRoom, description: e.target.value })
            }
            className="w-full p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio"
            value={newRoom.price}
            onChange={(e) => setNewRoom({ ...newRoom, price: e.target.value })}
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Crear
          </button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div key={room.id} className="relative">
              <RoomCard room={room} />
              <button
                onClick={() => handleDelete(room.id)}
                className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ManageRooms;
