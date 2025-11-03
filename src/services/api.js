// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ---------- HELPERS ----------
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const cleanUrl = (url) => (url.startsWith("/") ? url : `/${url}`);

// ---------- CORE ----------
const getData = async (url, headers = {}) => {
  const res = await fetch(`${BASE_URL}${cleanUrl(url)}`, {
    headers: { ...headers, ...getAuthHeaders() },
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
};

const postFormData = async (url, formData, headers = {}) => {
  const res = await fetch(`${BASE_URL}${cleanUrl(url)}`, {
    method: "POST",
    headers: { ...headers, ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
};

const putFormData = async (url, formData, headers = {}) => {
  const res = await fetch(`${BASE_URL}${cleanUrl(url)}`, {
    method: "PUT",
    headers: { ...headers, ...getAuthHeaders() },
    body: formData,
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json();
};

const deleteData = async (url) => {
  const res = await fetch(`${BASE_URL}${cleanUrl(url)}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
  return res.json().catch(() => ({ message: "Deleted" }));
};

// ---------- API's ----------
// src/services/api.js  (solo cambia roomsAPI)
export const roomsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/rooms/?skip=${skip}&limit=${limit}`),

  getById: async (id) => getData(`/rooms/${id}`),

  // ⚙️ OBLIGATORIO: token + db por query
  create: async (formData) => {
    const params = new URLSearchParams({
      token: localStorage.getItem("token") || "",
      db: "hotel_dd",
    });
    return postFormData(`/rooms?${params}`, formData);
  },

  update: async (id, formData) => {
    const params = new URLSearchParams({
      token: localStorage.getItem("token") || "",
      db: "hotel_dd",
    });
    return putFormData(`/rooms/${id}?${params}`, formData);
  },

  delete: async (id) => deleteData(`/rooms/${id}`),
};

export const servicesAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/services?skip=${skip}&limit=${limit}`),

  getAdminAll: async (skip = 0, limit = 100) =>
    getData(`/admin/services?skip=${skip}&limit=${limit}`),

  create: async (title, desc, iconFile) => {
    const form = new FormData();
    form.append("title", title);
    form.append("desc", desc);
    form.append("icon_file", iconFile);
    return postFormData("/admin/services", form);
  },

  update: async (id, title, desc, iconFile) => {
    const form = new FormData();
    if (title) form.append("title", title);
    if (desc) form.append("desc", desc);
    if (iconFile) form.append("icon_file", iconFile);
    return putFormData(`/admin/services/${id}`, form);
  },

  delete: async (id) => deleteData(`/admin/services/${id}`),
};

export const bookingsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/bookings?skip=${skip}&limit=${limit}`),

  create: async (bookingData) => {
    const res = await fetch(`${BASE_URL}/bookings`, {
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
    const res = await fetch(`${BASE_URL}/testimonials`, {
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
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  login: async (userData) => {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },

  getAll: async (skip = 0, limit = 100) =>
    getData(`/users?skip=${skip}&limit=${limit}`),

  // único endpoint que necesita token+db por query
  getAdminUsers: async (skip = 0, limit = 100, extra = {}) => {
    const params = new URLSearchParams({ skip, limit, ...extra });
    return getData(`/admin/users?${params}`);
  },

  updateRole: async (userId, role) => {
    const res = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ role }),
    });
    if (!res.ok) throw new Error(`Error ${res.status}: ${await res.text()}`);
    return res.json();
  },
};
