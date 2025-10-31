import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokenSource, setTokenSource] = useState("local"); // "local" | "session"
  const [ready, setReady] = useState(false);

  // Load from storage on boot
  useEffect(() => {
    try {
      const tLocal = localStorage.getItem("vh_access_token");
      const tSession = sessionStorage.getItem("vh_access_token");
      const uLocal = localStorage.getItem("vh_user");
      const uSession = sessionStorage.getItem("vh_user");

      const token = tLocal || tSession;
      const userJson = uLocal || uSession;
      if (token) {
        setTokenSource(tLocal ? "local" : "session");
      }
      if (userJson) {
        setUser(JSON.parse(userJson));
      }
    } catch {}
    setReady(true);
  }, []);

  const login = (token, userData, remember = true) => {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;

    try {
      store.setItem("vh_access_token", token);
      other.removeItem("vh_access_token");

      if (userData) {
        store.setItem("vh_user", JSON.stringify(userData));
        other.removeItem("vh_user");
        setUser(userData);
      }
      setTokenSource(remember ? "local" : "session");
    } catch {}
  };

  const logout = () => {
    try {
      localStorage.removeItem("vh_access_token");
      sessionStorage.removeItem("vh_access_token");
      localStorage.removeItem("vh_refresh_token");
      sessionStorage.removeItem("vh_refresh_token");
      localStorage.removeItem("vh_user");
      sessionStorage.removeItem("vh_user");
    } catch {}
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, ready, tokenSource, login, logout }),
    [user, ready, tokenSource]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
