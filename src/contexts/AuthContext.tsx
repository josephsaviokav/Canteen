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

  useEffect(() => {
    const stored = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    
    // Check if token exists and is valid
    if (storedToken && !isTokenExpired(storedToken)) {
      setToken(storedToken);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } else {
      // Token expired or invalid, clear storage
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
    
    setLoading(false);
  }, []);

  // Check token expiration periodically (every 5 seconds)
  useEffect(() => {
    if (!token) return;

    const intervalId = setInterval(() => {
      if (isTokenExpired(token)) {
        logout();
      }
    }, 5000); // Check every 5 seconds

    return () => clearInterval(intervalId);
  }, [token]);

  const login = (userData: User, jwtToken?: string) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    
    if (jwtToken) {
      localStorage.setItem("token", jwtToken);
      setToken(jwtToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
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
