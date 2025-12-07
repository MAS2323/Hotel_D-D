// src/services/api.js (actualizado: cambia restaurantAPI.createMenu y updateMenu para aceptar objeto menuData + file opcional, con validaciones para required fields en create, y parseFloat para price)
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

// ---------- HELPERS ----------
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
// Función para construir URLs con parámetros requeridos (sin token en query para auth)
const buildUrl = (url, params = {}) => {
  let finalUrl = url;
  if (!finalUrl.startsWith("/")) {
    finalUrl = "/" + finalUrl;
  }
  if (Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    const separator = finalUrl.includes("?") ? "&" : "?";
    finalUrl += separator + queryString;
  }
  return finalUrl; // NO agrega token/db
};

// ✅ Nueva API para contacto (usa JSON, similar a bookingsAPI.create)
export const contactAPI = {
  create: async (contactData) => {
    const res = await fetch(`${BASE_URL}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(contactData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },
};
// ---------- CORE ----------
const getData = async (url, params = {}, headers = {}) => {
  const finalUrl = buildUrl(url, params); // Solo skip/limit en query
  const res = await fetch(`${BASE_URL}${finalUrl}`, {
    headers: { ...headers, ...getAuthHeaders() }, // Bearer en header
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
};
const postFormData = async (url, formData, params = {}) => {
  const finalUrl = buildUrl(url, params);
  const response = await fetch(`${BASE_URL}${finalUrl}`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json();
};

const putFormData = async (url, formData, params = {}, headers = {}) => {
  const finalUrl = buildUrl(url, params);
  const res = await fetch(`${BASE_URL}${finalUrl}`, {
    method: "PUT",
    headers: { ...headers, ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
};

const deleteData = async (url, params = {}) => {
  const finalUrl = buildUrl(url, params);
  const res = await fetch(`${BASE_URL}${finalUrl}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json().catch(() => ({ message: "Deleted" }));
};

// ---------- API's ----------
export const roomsAPI = {
  getAll: async (skip = 0, limit = 100) => getData(`/rooms/`, { skip, limit }),

  getById: async (id) => getData(`/rooms/${id}`),

  create: async (formData) => {
    return postFormData(`/rooms/`, formData); // false implícito: solo header
  },

  update: async (id, formData) => {
    return putFormData(`/rooms/${id}`, formData); // false implícito
  },

  delete: async (id) => deleteData(`/rooms/${id}`),
};

export const servicesAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/services`, { skip, limit }),

  getAdminAll: async (skip = 0, limit = 100) =>
    getData(`/admin/services`, { skip, limit }), // false: solo header, no query token

  create: async (title, desc, iconFile) => {
    const form = new FormData();
    form.append("title", title);
    form.append("desc", desc);
    if (iconFile) form.append("file", iconFile);
    return postFormData("/admin/services", form); // false: solo header
  },

  update: async (id, title, desc, iconFile) => {
    const form = new FormData();
    if (title) form.append("title", title);
    if (desc) form.append("desc", desc);
    if (iconFile) form.append("file", iconFile);
    return putFormData(`/admin/services/${id}`, form); // false
  },

  delete: async (id) => deleteData(`/admin/services/${id}`), // false
};

export const bookingsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/bookings`, { skip, limit }),

  create: async (bookingData) => {
    const res = await fetch(`${BASE_URL}/bookings`, {
      // URL limpia
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // NUEVO: update con JSON (similar a create)
  update: async (id, bookingData) => {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  // NUEVO: delete (sin body)
  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json().catch(() => ({ message: "Deleted" }));
  },
};

export const galleryAPI = {
  getAll: async (skip = 0, limit = 100, category = "galeria") =>
    getData(`/gallery`, { skip, limit, category }),

  create: async (alt, desc, file, category = "galeria") => {
    const form = new FormData();
    form.append("alt", alt);
    form.append("desc", desc);
    form.append("category", category);
    if (file) {
      form.append("file", file);
    }
    return postFormData("/gallery", form);
  },
  update: async (id, alt, desc, file, category) => {
    const form = new FormData();
    if (alt !== undefined) form.append("alt", alt);
    if (desc !== undefined) form.append("desc", desc);
    if (category !== undefined) form.append("category", category);
    if (file) form.append("file", file);
    return putFormData(`/gallery/${id}`, form);
  },

  delete: async (id) => deleteData(`/gallery/${id}`),
};

// ✅ Nueva API para hero (similar a galleryAPI, pero con endpoints /hero y default category="hero")
export const heroAPI = {
  getAll: async (skip = 0, limit = 100, category = "hero") =>
    getData(`/hero`, { skip, limit, category }),

  create: async (alt, desc, file, category = "hero") => {
    const form = new FormData();
    form.append("alt", alt);
    form.append("desc", desc);
    form.append("category", category);
    if (file) {
      form.append("file", file);
    }
    return postFormData("/hero", form);
  },
  update: async (id, alt, desc, file, category) => {
    const form = new FormData();
    if (alt !== undefined) form.append("alt", alt);
    if (desc !== undefined) form.append("desc", desc);
    if (category !== undefined) form.append("category", category);
    if (file) form.append("file", file);
    return putFormData(`/hero/${id}`, form);
  },

  delete: async (id) => deleteData(`/hero/${id}`),
};

export const usersAPI = {
  register: async (userData) => {
    const res = await fetch(`${BASE_URL}/users/`, {
      // URL limpia
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  login: async (userData) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      // URL limpia
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  getAll: async (skip = 0, limit = 100) => getData(`/users`, { skip, limit }),

  getAdminUsers: async (skip = 0, limit = 100, extra = {}) => {
    const params = { skip, limit, ...extra }; // Solo paginación
    return getData(`/admin/users`, params); // false: solo header
  },

  updateRole: async (userId, role) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
      // URL limpia
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },
};

// src/services/api.js (actualizado: agrega delete a testimonialsAPI)
export const testimonialsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/testimonials`, { skip, limit }),

  create: async (testimonialData) => {
    const res = await fetch(`${BASE_URL}/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(testimonialData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/testimonials/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json().catch(() => ({ message: "Deleted" }));
  },
};
// src/services/api.js (actualizado: agrega create y update para restaurant usando FormData, similar a createMenu)
export const restaurantAPI = {
  get: async () => getData("/restaurant/"),
  getMenu: async () => getData("/restaurant/menu"),
  create: async (title, description, file) => {
    if (!title || !description) {
      throw new Error("Título y descripción son requeridos");
    }
    if (!file) {
      throw new Error("La imagen es requerida");
    }
    const form = new FormData();
    form.append("title", title);
    form.append("description", description);
    form.append("file", file);
    return postFormData("/restaurant", form);
  },
  update: async (id, title, description, file) => {
    const form = new FormData();
    if (title !== undefined) form.append("title", title);
    if (description !== undefined) form.append("description", description);
    if (file) form.append("file", file);
    return putFormData(`/restaurant/${id}`, form);
  },
  createMenu: async (menuData, file) => {
    // Validaciones para campos requeridos
    if (
      !menuData ||
      !menuData.name ||
      !menuData.description ||
      menuData.price === undefined ||
      menuData.price === null ||
      !menuData.category
    ) {
      throw new Error(
        "Todos los campos requeridos (name, description, price, category) deben estar presentes"
      );
    }
    const numPrice = parseFloat(menuData.price);
    if (isNaN(numPrice)) {
      throw new Error("El precio debe ser un número válido");
    }
    if (!file) {
      throw new Error("El archivo de imagen es requerido");
    }

    const form = new FormData();
    form.append("name", menuData.name);
    form.append("description", menuData.description);
    form.append("price", numPrice);
    form.append("category", menuData.category);
    form.append("file", file);
    return postFormData("/restaurant/menu", form);
  },
  updateMenu: async (id, menuData, file) => {
    const form = new FormData();
    if (menuData) {
      if (menuData.name !== undefined) form.append("name", menuData.name);
      if (menuData.description !== undefined)
        form.append("description", menuData.description);
      if (menuData.price !== undefined && menuData.price !== null) {
        const numPrice = parseFloat(menuData.price);
        if (!isNaN(numPrice)) {
          form.append("price", numPrice);
        }
      }
      if (menuData.category !== undefined)
        form.append("category", menuData.category);
    }
    if (file) form.append("file", file);
    return putFormData(`/restaurant/menu/${id}`, form);
  },
  deleteMenu: async (id) => {
    const res = await fetch(`${BASE_URL}/restaurant/menu/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json().catch(() => ({ message: "Deleted" }));
  },
};

// ✅ API para estadísticas del dashboard (si las necesitas)
export const statsAPI = {
  getUsers: async () => getData("/admin/stats/users"),
  getRooms: async () => getData("/admin/stats/rooms"),
  getApartments: async () => getData("/admin/stats/apartments"),
  getBookings: async () => getData("/admin/stats/bookings"),
  getServices: async () => getData("/admin/stats/services"),
  getMenuItems: async () => getData("/admin/stats/menu"),
};

// ✅ Nueva API para apartments (similar a roomsAPI, con soporte para FormData e imágenes)
export const apartmentsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/apartments`, { skip, limit }),

  getById: async (id) => getData(`/apartments/${id}`),

  create: async (formData) => postFormData(`/apartments`, formData),

  update: async (id, formData) => putFormData(`/apartments/${id}`, formData),

  delete: async (id) => deleteData(`/apartments/${id}`),
};
