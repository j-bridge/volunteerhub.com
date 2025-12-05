import axios from "axios";

const envBase = import.meta?.env?.VITE_API_URL;
const runtimeOrigin = typeof window !== "undefined" ? window.location.origin : null;
const fallbackBase = runtimeOrigin || "http://127.0.0.1:5001";
const RAW_BASE = (envBase || fallbackBase).replace(/\/+$/, "");
const API_BASE = RAW_BASE.endsWith("/api") ? RAW_BASE : `${RAW_BASE}/api`;

export const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const method = (config.method || "get").toLowerCase();

  // Normalize headers object (axios can nest by method/common)
  const removeContentType = () => {
    if (!config.headers) return;
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
    if (config.headers.common) {
      delete config.headers.common["Content-Type"];
      delete config.headers.common["content-type"];
    }
    if (config.headers[method]) {
      delete config.headers[method]["Content-Type"];
      delete config.headers[method]["content-type"];
    }
  };

  const setJsonContentType = () => {
    if (!config.headers) config.headers = {};
    config.headers["Content-Type"] = "application/json";
  };

  // Only set content-type for methods that send a body and when data is not FormData
  if (["post", "put", "patch"].includes(method) && config.data && !(config.data instanceof FormData)) {
    setJsonContentType();
  } else {
    removeContentType();
  }

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
