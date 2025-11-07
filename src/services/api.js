// src/services/api.js
// const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
const BASE_URL = "http://localhost:8000";

// ---------- HELPERS ----------
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Función para construir URLs con parámetros requeridos
const buildUrl = (url, includeAuthParams = false) => {
  let finalUrl = url;

  // Asegurar que la URL tenga el formato correcto
  if (!finalUrl.startsWith("/")) {
    finalUrl = "/" + finalUrl;
  }

  // Agregar parámetros de autenticación si se requieren
  if (includeAuthParams) {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams();
    if (token) {
      params.append("token", token);
    }
    params.append("db", "hotel_dd");

    // Manejar si la URL ya tiene parámetros
    const separator = finalUrl.includes("?") ? "&" : "?";
    finalUrl = finalUrl + separator + params.toString();
  }

  return finalUrl;
};

// ---------- CORE ----------
const getData = async (url, includeAuthParams = false, headers = {}) => {
  const finalUrl = buildUrl(url, includeAuthParams);
  const res = await fetch(`${BASE_URL}${finalUrl}`, {
    headers: { ...headers, ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
};

const postFormData = async (url, formData, includeAuthParams = false) => {
  const finalUrl = buildUrl(url, includeAuthParams);
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

const putFormData = async (
  url,
  formData,
  includeAuthParams = false,
  headers = {}
) => {
  const finalUrl = buildUrl(url, includeAuthParams);
  const res = await fetch(`${BASE_URL}${finalUrl}`, {
    method: "PUT",
    headers: { ...headers, ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
};

const deleteData = async (url, includeAuthParams = true) => {
  const finalUrl = buildUrl(url, includeAuthParams); // ← true
  const res = await fetch(`${BASE_URL}${finalUrl}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json().catch(() => ({ message: "Deleted" }));
};

// ---------- API's ----------
export const roomsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/rooms/?skip=${skip}&limit=${limit}`),

  getById: async (id) => getData(`/rooms/${id}`),

  // ✅ CORREGIDO: Incluye parámetros de autenticación
  create: async (formData) => {
    return postFormData(`/rooms/`, formData, true); // true = incluir token & db
  },

  update: async (id, formData) => {
    return putFormData(`/rooms/${id}`, formData, true); // true = incluir token & db
  },

  delete: async (id) => deleteData(`/rooms/${id}`),
};

export const servicesAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/services?skip=${skip}&limit=${limit}`),

  getAdminAll: async (skip = 0, limit = 100) =>
    getData(`/admin/services?skip=${skip}&limit=${limit}`, true), // ✅ Incluir auth params

  create: async (title, desc, iconFile) => {
    const form = new FormData();
    form.append("title", title);
    form.append("desc", desc);
    form.append("icon_file", iconFile);
    return postFormData("/admin/services", form, true); // ✅ Incluir auth params
  },

  update: async (id, title, desc, iconFile) => {
    const form = new FormData();
    if (title) form.append("title", title);
    if (desc) form.append("desc", desc);
    if (iconFile) form.append("icon_file", iconFile);
    return putFormData(`/admin/services/${id}`, form, true); // ✅ Incluir auth params
  },

  delete: async (id) => deleteData(`/admin/services/${id}`, true), // ✅ Incluir auth params
};

export const bookingsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/bookings?skip=${skip}&limit=${limit}`),

  create: async (bookingData) => {
    const finalUrl = buildUrl("/bookings");
    const res = await fetch(`${BASE_URL}${finalUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(bookingData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },
};

export const galleryAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/gallery?skip=${skip}&limit=${limit}`),

  create: async (alt, desc, file) => {
    const form = new FormData();
    form.append("alt", alt);
    form.append("desc", desc);
    form.append("file", file);
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
    getData(`/testimonials?skip=${skip}&limit=${limit}`),

  create: async (testimonialData) => {
    const finalUrl = buildUrl("/testimonials");
    const res = await fetch(`${BASE_URL}${finalUrl}`, {
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
    const finalUrl = buildUrl("/users/");
    const res = await fetch(`${BASE_URL}${finalUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  login: async (userData) => {
    const finalUrl = buildUrl("/users/login");
    const res = await fetch(`${BASE_URL}${finalUrl}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  getAll: async (skip = 0, limit = 100) =>
    getData(`/users?skip=${skip}&limit=${limit}`),

  // ✅ CORREGIDO: Usar el nuevo sistema de parámetros
  getAdminUsers: async (skip = 0, limit = 100, extra = {}) => {
    const params = new URLSearchParams({ skip, limit, ...extra }).toString();
    return getData(`/admin/users?${params}`, true); // true = incluir token & db
  },

  updateRole: async (userId, role) => {
    const finalUrl = buildUrl(`/admin/users/${userId}/role`, true); // ✅ Incluir auth params
    const res = await fetch(`${BASE_URL}${finalUrl}`, {
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
  getUsers: async () => getData("/admin/stats/users", true),
  getRooms: async () => getData("/admin/stats/rooms", true),
  getBookings: async () => getData("/admin/stats/bookings", true),
  getServices: async () => getData("/admin/stats/services", true),
};
