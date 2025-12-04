import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext(null);

// Ensure user object always has our extra arrays
function normalizeUser(raw) {
  if (!raw) return null;
  return {
    ...raw,
    appliedOpportunities: raw.appliedOpportunities || [],
    createdOpportunities: raw.createdOpportunities || [],
    savedOpportunities: raw.savedOpportunities || [],
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tokenSource, setTokenSource] = useState("local"); // "local" | "session"
  const [ready, setReady] = useState(false);

  // Helper: update user in state + correct storage based on tokenSource
  const setAndStoreUser = (updater) => {
    setUser((current) => {
      const prev = current || null;
      const next =
        typeof updater === "function" ? normalizeUser(updater(prev)) : normalizeUser(updater);

      try {
        const store = tokenSource === "local" ? localStorage : sessionStorage;
        if (next) {
          store.setItem("vh_user", JSON.stringify(next));
        } else {
          store.removeItem("vh_user");
        }
      } catch {
        // ignore storage errors
      }

      return next;
    });
  };

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
        const parsed = JSON.parse(userJson);
        setUser(normalizeUser(parsed));
      }
    } catch {
      // ignore parse/storage errors
    }

    setReady(true);
  }, []);

  const login = (token, userData, remember = true) => {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    const normalized = normalizeUser(userData || {});

    try {
      store.setItem("vh_access_token", token);
      other.removeItem("vh_access_token");

      store.setItem("vh_user", JSON.stringify(normalized));
      other.removeItem("vh_user");
    } catch {
      // ignore storage errors
    }

    setTokenSource(remember ? "local" : "session");
    setUser(normalized);
  };

  const logout = () => {
    try {
      localStorage.removeItem("vh_access_token");
      sessionStorage.removeItem("vh_access_token");
      localStorage.removeItem("vh_refresh_token");
      sessionStorage.removeItem("vh_refresh_token");
      localStorage.removeItem("vh_user");
      sessionStorage.removeItem("vh_user");
    } catch {
      // ignore
    }
    setUser(null);
  };

  const updateUserProfile = (partial) => {
    setAndStoreUser((prev) => {
      if (!prev) return prev;
      return { ...prev, ...partial };
    });
  };

  // ---------- volunteer: applications ----------

  const applyToOpportunity = (oppSummary) => {
    if (!oppSummary) return;

    setAndStoreUser((prev) => {
      if (!prev) return prev;
      const existing = prev.appliedOpportunities || [];

      // avoid duplicates
      if (existing.some((o) => String(o.id) === String(oppSummary.id))) {
        return prev;
      }

      return {
        ...prev,
        appliedOpportunities: [...existing, oppSummary],
      };
    });
  };

  const cancelApplication = (id) => {
    setAndStoreUser((prev) => {
      if (!prev) return prev;
      const existing = prev.appliedOpportunities || [];
      return {
        ...prev,
        appliedOpportunities: existing.filter(
          (o) => String(o.id) !== String(id)
        ),
      };
    });
  };

  // ---------- volunteer: saved opportunities ----------

  const saveOpportunity = (oppSummary) => {
    if (!oppSummary) return;

    setAndStoreUser((prev) => {
      if (!prev) return prev;
      const existing = prev.savedOpportunities || [];

      if (existing.some((o) => String(o.id) === String(oppSummary.id))) {
        return prev;
      }

      return {
        ...prev,
        savedOpportunities: [...existing, oppSummary],
      };
    });
  };

  const removeSavedOpportunity = (id) => {
    setAndStoreUser((prev) => {
      if (!prev) return prev;
      const existing = prev.savedOpportunities || [];
      return {
        ...prev,
        savedOpportunities: existing.filter(
          (o) => String(o.id) !== String(id)
        ),
      };
    });
  };

  // ---------- organization: created opportunities ----------

  const createOpportunity = (opp) => {
    if (!opp) return null;

    const generatedId = opp.id
      ? String(opp.id)
      : `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const full = { ...opp, id: generatedId };

    setAndStoreUser((prev) => {
      if (!prev) return prev;
      const existing = prev.createdOpportunities || [];
      return {
        ...prev,
        createdOpportunities: [...existing, full],
      };
    });

    return full;
  };

  const updateCreatedOpportunity = (id, patch) => {
    setAndStoreUser((prev) => {
      if (!prev) return prev;
      const existing = prev.createdOpportunities || [];
      return {
        ...prev,
        createdOpportunities: existing.map((o) =>
          String(o.id) === String(id) ? { ...o, ...patch } : o
        ),
      };
    });
  };

  const deleteCreatedOpportunity = (id) => {
    setAndStoreUser((prev) => {
      if (!prev) return prev;
      const existing = prev.createdOpportunities || [];
      return {
        ...prev,
        createdOpportunities: existing.filter(
          (o) => String(o.id) !== String(id)
        ),
      };
    });
  };

  const value = useMemo(
    () => ({
      user,
      ready,
      tokenSource,
      login,
      logout,
      updateUserProfile,
      applyToOpportunity,
      cancelApplication,
      saveOpportunity,
      removeSavedOpportunity,
      createOpportunity,
      updateCreatedOpportunity,
      deleteCreatedOpportunity,
    }),
    [user, ready, tokenSource]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
