import axios from "axios";

const envBase = import.meta?.env?.VITE_API_URL;
const runtimeOrigin = typeof window !== "undefined" ? window.location.origin : null;
const fallbackBase = runtimeOrigin || "http://127.0.0.1:5001";
const RAW_BASE = (envBase || fallbackBase).replace(/\/+$/, "");
const API_BASE = RAW_BASE.endsWith("/api") ? RAW_BASE : `${RAW_BASE}/api`;

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
