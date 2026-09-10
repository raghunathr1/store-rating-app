const API_BASE_URL = "http://localhost:5000/api";

// Common API request helper
const apiRequest = async (url, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

// ==================== AUTH ====================

export const loginUser = async (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
    }),
  });
};

export const signupUser = async (userData) => {
  return apiRequest("/auth/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const changePassword = async (currentPassword, newPassword) => {
  const token = localStorage.getItem("token");

  return apiRequest("/auth/change-password", {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
    }),
  });
};

// ==================== ADMIN ====================

export const getAdminDashboard = async () => {
  const token = localStorage.getItem("token");

  return apiRequest("/admin/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addUser = async (userData) => {
  const token = localStorage.getItem("token");

  return apiRequest("/admin/users", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });
};

export const getUsers = async (params = "") => {
  const token = localStorage.getItem("token");

  return apiRequest(`/admin/users${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserDetails = async (userId) => {
  const token = localStorage.getItem("token");

  return apiRequest(`/admin/users/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ==================== ADMIN STORES ====================

export const addStore = async (storeData) => {
  const token = localStorage.getItem("token");

  return apiRequest("/admin/stores", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(storeData),
  });
};

export const getAdminStores = async (params = "") => {
  const token = localStorage.getItem("token");

  return apiRequest(`/admin/stores${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ==================== NORMAL USER ====================

export const getUserStores = async (params = "") => {
  const token = localStorage.getItem("token");

  return apiRequest(`/user/stores${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitRating = async (storeId, rating) => {
  const token = localStorage.getItem("token");

  return apiRequest("/user/ratings", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      store_id: storeId,
      rating,
    }),
  });
};

// ==================== OWNER ====================

export const getOwnerDashboard = async () => {
  const token = localStorage.getItem("token");

  return apiRequest("/owner/dashboard", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getOwnerRaters = async () => {
  const token = localStorage.getItem("token");

  return apiRequest("/owner/raters", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};