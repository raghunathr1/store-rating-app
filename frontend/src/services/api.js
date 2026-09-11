const API_BASE_URL = "https://store-rating-app-ew9z.onrender.com/api";

// ==================== COMMON API REQUEST ====================

const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });

    // Try to read JSON response
    const data = await response.json();

    console.log(`API RESPONSE [${url}]:`, data);

    if (!response.ok) {
      throw new Error(
        data.message || "Something went wrong"
      );
    }

    return data;

  } catch (error) {
    console.error(`API ERROR [${url}]:`, error);
    throw error;
  }
};


// ==================== AUTH ====================

// LOGIN
export const loginUser = async (email, password) => {
  return apiRequest("/auth/login", {
    method: "POST",

    body: JSON.stringify({
      email,
      password,
    }),
  });
};


// SIGNUP
export const signupUser = async (userData) => {
  return apiRequest("/auth/signup", {
    method: "POST",

    body: JSON.stringify(userData),
  });
};


// CHANGE PASSWORD
export const changePassword = async (
  currentPassword,
  newPassword
) => {
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

// ADMIN DASHBOARD
export const getAdminDashboard = async () => {
  const token = localStorage.getItem("token");

  return apiRequest("/admin/dashboard", {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// ADD USER
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


// GET USERS
export const getUsers = async (params = "") => {
  const token = localStorage.getItem("token");

  return apiRequest(`/admin/users${params}`, {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// GET USER DETAILS
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

// ADD STORE
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


// GET ADMIN STORES
export const getAdminStores = async (params = "") => {
  const token = localStorage.getItem("token");

  const data = await apiRequest(`/admin/stores${params}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log("ADMIN STORES API RESPONSE:", data);

  return Array.isArray(data)
    ? data
    : Array.isArray(data.stores)
    ? data.stores
    : [];
};


// ==================== NORMAL USER ====================

// GET USER STORES
export const getUserStores = async (params = "") => {
  const token = localStorage.getItem("token");

  const data = await apiRequest(
    `/user/stores${params}`,
    {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  console.log(
    "USER STORES API RESPONSE:",
    data
  );

  // Backend directly returns array
  if (Array.isArray(data)) {
    return data;
  }

  // Backend returns { stores: [...] }
  if (
    data &&
    Array.isArray(data.stores)
  ) {
    return data.stores;
  }

  // Backend returns { data: [...] }
  if (
    data &&
    Array.isArray(data.data)
  ) {
    return data.data;
  }

  console.error(
    "Unexpected stores response:",
    data
  );

  return [];
};


// SUBMIT RATING
export const submitRating = async (
  storeId,
  rating
) => {
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

// OWNER DASHBOARD
export const getOwnerDashboard = async () => {
  const token = localStorage.getItem("token");

  return apiRequest("/owner/dashboard", {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// OWNER RATERS
export const getOwnerRaters = async () => {
  const token = localStorage.getItem("token");

  return apiRequest("/owner/raters", {
    method: "GET",

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};