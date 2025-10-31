import axios from "axios";

const API_BASE = (import.meta.env.VITE_API_URL || "http://127.0.0.1:5000").replace(/\/+$/, "");

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token =
    window.localStorage.getItem("vh_access_token") ||
    window.sessionStorage.getItem("vh_access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error?.response?.status === 401) {
      try {
        localStorage.removeItem("vh_access_token");
        sessionStorage.removeItem("vh_access_token");
        localStorage.removeItem("vh_refresh_token");
        sessionStorage.removeItem("vh_refresh_token");
        localStorage.removeItem("vh_user");
        sessionStorage.removeItem("vh_user");
      } catch {}
    }
    return Promise.reject(error);
  }
);
