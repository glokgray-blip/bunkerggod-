import { useState, useEffect } from "react";

// Mock authentication hook using localStorage for the bunker super-app
export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem("bunker_auth") === "true";
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(localStorage.getItem("bunker_auth") === "true");
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const login = (provider: string) => {
    console.log(`Logging in via ${provider}...`);
    localStorage.setItem("bunker_auth", "true");
    setIsAuthenticated(true);
    // trigger event for other tabs
    window.dispatchEvent(new Event("storage"));
  };

  const logout = () => {
    localStorage.removeItem("bunker_auth");
    setIsAuthenticated(false);
    window.dispatchEvent(new Event("storage"));
  };

  const selfDestruct = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return {
    isAuthenticated,
    login,
    logout,
    selfDestruct
  };
}
