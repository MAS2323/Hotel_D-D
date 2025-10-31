// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Helper to get auth token from localStorage (assuming useAuth stores it there)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token"); // Adjust key if different
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper for POST/PUT with FormData (for file uploads)
const postFormData = async (url, formData, headers = {}) => {
  const cleanUrl = url.startsWith("/") ? url : `/${url}`; // Limpia URLs para evitar double slashes
  const response = await fetch(`${BASE_URL}${cleanUrl}`, {
    method: "POST",
    headers: { ...headers, ...getAuthHeaders() },
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json();
};

// Helper for PUT with FormData
const putFormData = async (url, formData, headers = {}) => {
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  const response = await fetch(`${BASE_URL}${cleanUrl}`, {
    method: "PUT",
    headers: { ...headers, ...getAuthHeaders() },
    body: formData,
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json();
};

// Helper for GET
const getData = async (url, headers = {}) => {
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  const response = await fetch(`${BASE_URL}${cleanUrl}`, {
    headers: { ...headers, ...getAuthHeaders() },
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json();
};

// Helper for DELETE
const deleteData = async (url) => {
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  const response = await fetch(`${BASE_URL}${cleanUrl}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }
  return response.json() || { message: "Deleted" };
};

// Rooms API
export const roomsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/rooms?skip=${skip}&limit=${limit}`),
  getById: async (id) => getData(`/rooms/${id}`), // Asegura que id sea número, no :1 literal
  create: async (formData) => postFormData("/rooms", formData),
  update: async (id, formData) => putFormData(`/rooms/${id}`, formData),
  delete: async (id) => deleteData(`/rooms/${id}`),
};

// Services API (Public GET, Admin CRUD)
export const servicesAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/services?skip=${skip}&limit=${limit}`),
  // Admin endpoints
  getAdminAll: async (skip = 0, limit = 100) =>
    getData(`/admin/services?skip=${skip}&limit=${limit}`),
  create: async (title, desc, iconFile) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("desc", desc);
    formData.append("icon_file", iconFile);
    return postFormData("/admin/services", formData);
  },
  update: async (id, title, desc, iconFile) => {
    const formData = new FormData();
    if (title) formData.append("title", title);
    if (desc) formData.append("desc", desc);
    if (iconFile) formData.append("icon_file", iconFile);
    return putFormData(`/admin/services/${id}`, formData);
  },
  delete: async (id) => deleteData(`/admin/services/${id}`),
};

// Bookings API
export const bookingsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/bookings?skip=${skip}&limit=${limit}`),
  create: async (bookingData) => {
    const response = await fetch(`${BASE_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(bookingData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  },
};

// Gallery API (Images)
export const galleryAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/gallery?skip=${skip}&limit=${limit}`),
  create: async (alt, desc, file) => {
    const formData = new FormData();
    formData.append("alt", alt);
    formData.append("desc", desc);
    formData.append("file", file);
    return postFormData("/gallery", formData);
  },
  update: async (id, alt, desc, file) => {
    const formData = new FormData();
    if (alt) formData.append("alt", alt);
    if (desc) formData.append("desc", desc);
    if (file) formData.append("file", file);
    return putFormData(`/gallery/${id}`, formData);
  },
  delete: async (id) => deleteData(`/gallery/${id}`),
};

// Testimonials API
export const testimonialsAPI = {
  getAll: async (skip = 0, limit = 100) =>
    getData(`/testimonials?skip=${skip}&limit=${limit}`),
  create: async (testimonialData) => {
    const response = await fetch(`${BASE_URL}/testimonials`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify(testimonialData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  },
};

// Users API (Public register/login, Admin users)
export const usersAPI = {
  register: async (userData) => {
    const response = await fetch(`${BASE_URL}/users/`, {
      // Mantiene / para register
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  },
  login: async (userData) => {
    const response = await fetch(`${BASE_URL}/users/login`, {
      // Sin trailing / para evitar 404
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  },
  getAll: async (skip = 0, limit = 100) =>
    getData(`/users?skip=${skip}&limit=${limit}`),
  // Admin specific
  getAdminUsers: async (skip = 0, limit = 100) =>
    getData(`/admin/users?skip=${skip}&limit=${limit}`),
  updateRole: async (userId, role) => {
    const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...getAuthHeaders() },
      body: JSON.stringify({ role }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }
    return response.json();
  },
};
