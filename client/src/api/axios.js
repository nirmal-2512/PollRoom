import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ✅ Attach token automatically
api.interceptors.request.use((config) => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
  } catch {}

  return config;
});

export default api;
