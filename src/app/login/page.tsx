"use client";

import Header from "@/components/Header";
import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { redirect, useRouter } from "next/navigation";
import { usersApi } from "@/lib/api";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Customer" | "Admin">("Customer");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    // const usersStr = localStorage.getItem("users");
    // if (!usersStr) {
    //   setError("No accounts found. Please sign up.");
    //   return;
    // }

    // const users: {
    //   email: string;
    //   password: string;
    //   role: "customer" | "admin";
    // };

    // const email = email;
    //   const password = password;

    usersApi.signIn(email, password)
      .then((data) => {
        if (data.success && data.data) {
          // Store user and token
          localStorage.setItem("user", JSON.stringify(data.data.user));
          localStorage.setItem("token", data.data.token);
          login(data.data.user, data.data.token);

          // Redirect to the page came from or home
          var role = data.data.user.role;
          if(role === "admin"){
            router.push("/admin/dashboard");
            return;
          }
          const previous = sessionStorage.getItem("redirectAfterLogin");
          sessionStorage.removeItem("redirectAfterLogin"); // Clean up
          router.push(previous || "/");
        } else {
          setError(data.message || "Sign in failed");
        }
      })
      .catch((err) => {
        setError(err.message || "Sign in failed");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* LEFT FORM */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              Welcome Back
            </h1>

            <form onSubmit={handleLogin} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <select
                  value={role}
                  onChange={(e) =>
                    setRole(e.target.value as "Customer" | "Admin")
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:ring-2 focus:ring-green-500 focus:outline-none"
                >
                  <option value="Customer">Customer</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition-colors"
              >
                Login
              </button>
            </form>

            <p className="text-sm text-gray-600 mt-4 text-center">
              Don’t have an account?{" "}
              <Link
                href="/signup"
                className="text-green-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="hidden lg:flex items-center justify-center">
            <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
              We'll add something interesting here, like some animation -
              something interactive and engaging
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
