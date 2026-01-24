"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "customer" | "admin" | "Customer" | "Admin";
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (userData: User, token?: string) => void;
  logout: () => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to decode JWT and check expiration
const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    return true; // If token is invalid, consider it expired
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);

    // Notify other contexts about user change
    window.dispatchEvent(new Event("userChanged"));
    
    // Redirect to login
    router.push("/login");
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    // Check if token exists and is valid
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } else if (storedToken) {
      // Token expired or invalid, clear storage and redirect
      // localStorage.removeItem("user");
      // localStorage.removeItem("token");
      // router.push("/login");
      logout();
    }
    
    setLoading(false);
  }, [router]);

  // Check token expiration - optimized approach
  useEffect(() => {
    if (!token) return;

    const checkTokenExpiration = () => {
      const storedToken = localStorage.getItem("token");
      if (!storedToken || isTokenExpired(storedToken)) {
        console.log("Token expired, logging out...");
        logout();
      }
    };

    // Get token expiration time
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      const now = Date.now();
      const timeUntilExpiry = exp - now;

      // If token expires in less than 5 minutes, check every 10 seconds
      // Otherwise check every 60 seconds
      const checkInterval = timeUntilExpiry < 5 * 60 * 1000 ? 10000 : 60000;

      // Set up interval check
      const intervalId = setInterval(checkTokenExpiration, checkInterval);

      // Also set a timeout to check exactly when token expires
      if (timeUntilExpiry > 0) {
        const timeoutId = setTimeout(() => {
          checkTokenExpiration();
        }, timeUntilExpiry + 1000); // +1 second buffer

        return () => {
          clearInterval(intervalId);
          clearTimeout(timeoutId);
        };
      }

      return () => clearInterval(intervalId);
    } catch (error) {
      // Fallback: check every 60 seconds if token parsing fails
      const intervalId = setInterval(checkTokenExpiration, 60000);
      return () => clearInterval(intervalId);
    }
  }, [token]);

  const login = (userData: User, jwtToken?: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    if (jwtToken) {
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
    }

    // Notify other contexts about user change
    window.dispatchEvent(new Event("userChanged"));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};
