"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function AdminLayout({
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
        router.push(`/login?redirect=${pathname}`);
      } else if (user.role !== "admin") {
        router.push("/");
      }
    }
  }, [user, loading, router, pathname]);

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!user || user.role !== "Admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">Logged in as {user.email}</p>
          </div>

          <nav className="flex gap-6">
            <AdminTab href="/admin/dashboard" label="Dashboard" />
            <AdminTab href="/admin/orders" label="Orders" />
            <AdminTab href="/admin/inventory" label="Inventory" />
          </nav>
        </div>
      </div>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}

function AdminTab({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={`font-medium ${
        active
          ? "text-green-600 border-b-2 border-green-600 pb-1"
          : "text-gray-600 hover:text-gray-900"
      }`}
    >
      {label}
    </Link>
  );
}
