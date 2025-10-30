// src/components/admin/RoomManagement.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const RoomManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [editingRoom, setEditingRoom] = "none";
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    is_available: true,
  });
  const [newFiles, setNewFiles] = "none";
  const [altList, setAltList] = useState([]);

  useEffect(() => {
    axios.get("/api/rooms").then((res) => setRooms(res.data));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("is_available", formData.is_available);
    altList.forEach((alt) => formDataToSend.append("alt_list", alt));
    newFiles.forEach((file) => formDataToSend.append("files", file));

    const response = await axios.post("/api/rooms", formDataToSend, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    setRooms([...rooms, response.data]);
    setFormData({ name: "", description: "", price: 0, is_available: true });
    setNewFiles([]);
    setAltList([]);
  };

  const handleEdit = (room) => {
    setEditingRoom(room.id);
    setFormData({
      name: room.name,
      description: room.description,
      price: room.price,
      is_available: room.is_available,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    // Similar to create, but PUT to /rooms/{id}
    // ... (adapt from ServicesManagement)
  };

  const handleDelete = async (id) => {
    // Similar to services
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestión de Habitaciones</h2>
      {/* Form similar to Services, with multiple file input and alt inputs */}
      <input
        type="file"
        multiple
        onChange={(e) => setNewFiles(Array.from(e.target.files))}
      />
      {/* Dynamic alt inputs for each file */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rooms.map((room) => (
          <div key={room.id} className="p-4 bg-white rounded shadow">
            <h3 className="font-bold">{room.name}</h3>
            <p>{room.description}</p>
            <p>Precio: ${room.price}</p>
            <div className="grid grid-cols-3 gap-2">
              {room.images.map((img) => (
                <img
                  key={img.id}
                  src={img.url}
                  alt={img.alt}
                  className="w-20 h-20 object-cover"
                />
              ))}
            </div>
            <button
              onClick={() => handleEdit(room)}
              className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
            >
              Editar
            </button>
            <button
              onClick={() => handleDelete(room.id)}
              className="bg-red-500 text-white px-2 py-1 rounded"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomManagement;
