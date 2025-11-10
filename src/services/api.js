// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BASE_URL = "http://localhost:8000";

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
    form.append("icon_file", iconFile);
    return postFormData("/admin/services", form); // false: solo header
  },

  update: async (id, title, desc, iconFile) => {
    const form = new FormData();
    if (title) form.append("title", title);
    if (desc) form.append("desc", desc);
    if (iconFile) form.append("icon_file", iconFile);
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
};

export const galleryAPI = {
  getAll: async (skip = 0, limit = 100) => getData(`/gallery`, { skip, limit }),

  create: async (alt, desc, files) => {
    // Cambiado: files como array
    const form = new FormData();
    form.append("alt", alt);
    form.append("desc", desc);
    files.forEach((file) => {
      // Loop para múltiples
      form.append("files", file); // Backend espera 'files'
    });
    return postFormData("/gallery", form);
  },

  update: async (id, alt, desc, file) => {
    const form = new FormData();
    if (alt) form.append("alt", alt);
    if (desc) form.append("desc", desc);
    if (file) form.append("file", file);
    return putFormData(`/gallery/${id}`, form);
  },

  delete: async (id) => deleteData(`/gallery/${id}`),
};

export const testimonialsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/testimonials`, { skip, limit }),

  create: async (testimonialData) => {
    const res = await fetch(`${BASE_URL}/testimonials`, {
      // URL limpia
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(testimonialData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },
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

// ✅ API para estadísticas del dashboard (si las necesitas)
export const statsAPI = {
  getUsers: async () => getData("/admin/stats/users"),
  getRooms: async () => getData("/admin/stats/rooms"),
  getBookings: async () => getData("/admin/stats/bookings"),
  getServices: async () => getData("/admin/stats/services"),
};
