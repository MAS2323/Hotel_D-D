// src/services/api.js
const mockRooms = [
  {
    id: 1,
    name: "Cueva del Dragón",
    description:
      "Una suite oscura y misteriosa con toques de fuego y tesoros ocultos.",
    price: 250,
    image: "https://via.placeholder.com/400x300?text=Cueva+del+Dragón",
  },
  {
    id: 2,
    name: "Torre del Mago",
    description:
      "Habitacion elevada con vistas encantadas y elementos arcánicos.",
    price: 200,
    image: "https://via.placeholder.com/400x300?text=Torre+del+Mago",
  },
  {
    id: 3,
    name: "Bosque Encantado",
    description:
      "Entorno natural con elfos y magia verde para una estancia serena.",
    price: 180,
    image: "https://via.placeholder.com/400x300?text=Bosque+Encantado",
  },
];

export const roomsAPI = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: mockRooms });
      }, 500);
    });
  },
};
