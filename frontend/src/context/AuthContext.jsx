import { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Function to check if token is expired
  const isTokenExpired = () => {
    const tokenExpiry = localStorage.getItem("tokenExpiry");
    if (!tokenExpiry) return true;
    return Date.now() > parseInt(tokenExpiry);
  };

  // Function to clear authentication data
  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("tokenExpiry");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Check session on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token && !isTokenExpired()) {
      setIsAuthenticated(true);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } else if (token && isTokenExpired()) {
      // Token exists but is expired, clear it
      clearAuth();
    }
    
    setLoading(false);
  }, []);

  // Set up a timer to automatically logout when token expires
  useEffect(() => {
    if (isAuthenticated) {
      const tokenExpiry = localStorage.getItem("tokenExpiry");
      if (tokenExpiry) {
        const timeUntilExpiry = parseInt(tokenExpiry) - Date.now();
        
        if (timeUntilExpiry > 0) {
          const timer = setTimeout(() => {
            clearAuth();
            // Optionally show a notification that session expired
            alert("Your session has expired. Please log in again.");
          }, timeUntilExpiry);

          return () => clearTimeout(timer);
        }
      }
    }
  }, [isAuthenticated]);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });
    
    // Calculate expiry time (current time + expires_in seconds * 1000 for milliseconds)
    const expiryTime = Date.now() + (response.data.expires_in * 1000);
    
    // Store the token, user data, and expiry time
    localStorage.setItem("token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("tokenExpiry", expiryTime.toString());
    
    setUser(response.data.user);
    setIsAuthenticated(true);
    
    console.log("Login successful:", response.data);
  };

  const logout = async () => {
    try {
      // Try to call logout endpoint if token is still valid
      if (!isTokenExpired()) {
        await api.post("/auth/logout");
      }
    } catch {
      // If logout fails, still clear local data
      console.log("Logout API call failed, but clearing local data");
    } finally {
      clearAuth();
    }
  };

  const refreshUser = async () => {
    try {
      if (!isTokenExpired()) {
        const response = await api.post("/auth/me");
        const userData = response.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // If refresh fails and token is expired, logout
      if (isTokenExpired()) {
        clearAuth();
      }
      throw error; // Re-throw the error so calling components can handle it
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      refreshUser,
      isAuthenticated, 
      loading,
      isTokenExpired 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
