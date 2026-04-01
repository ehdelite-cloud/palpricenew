import { useState, useCallback } from "react";

/**
 * useAuth — reads and manages auth tokens from localStorage
 *
 * Usage:
 *   const { token, headers } = useAuth("user");   // reads userToken
 *   const { token, headers } = useAuth("store");  // reads storeToken
 *   const { token, headers } = useAuth("admin");  // reads adminToken
 */
export function useAuth(type = "user") {
  const KEY_MAP = {
    user:  "userToken",
    store: "storeToken",
    admin: "adminToken",
  };

  const storageKey = KEY_MAP[type] || "userToken";
  const [token, setToken] = useState(() => localStorage.getItem(storageKey));

  const headers = useCallback(() => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }), [token]);

  function saveToken(t) {
    localStorage.setItem(storageKey, t);
    setToken(t);
  }

  function clearToken() {
    localStorage.removeItem(storageKey);
    setToken(null);
  }

  return { token, headers, saveToken, clearToken, isLoggedIn: !!token };
}
