"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "@/components/Header";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace(`/login?redirect=${pathname}`);
      } else if (user.role !== "customer") {
        router.replace("/");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading || !user || user.role !== "customer") {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* User Top Panel */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6">
          <NavItem
            label="Dashboard"
            href="/user/dashboard"
            active={pathname === "/user/dashboard"}
          />
          <NavItem
            label="Orders"
            href="/user/orders"
            active={pathname === "/user/orders"}
          />
          <NavItem
            label="Profile"
            href="/user/profile"
            active={pathname === "/user/profile"}
          />
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

function NavItem({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className={`font-medium px-3 py-2 rounded-lg transition ${
        active
          ? "bg-green-100 text-green-700"
          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}
