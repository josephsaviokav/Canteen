"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function UserDashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Account Overview</h1>
        <p className="text-gray-500 text-sm mt-1">
          Manage your profile and orders
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <InfoRow label="Name" value={user.firstName + " " + user.lastName} />
        <InfoRow label="Email" value={user.email} />
        <InfoRow label="Role" value={user.role ?? "user"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ActionCard
          title="View Profile"
          description="Edit your personal details"
          href="/user/profile"
        />
        <ActionCard
          title="View Orders"
          description="Track, cancel or refund orders"
          href="/user/orders"
        />
        <ActionCard
          title="Security"
          description="Change password & settings"
          href="#"
          disabled
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  disabled,
}: {
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
}) {
  return (
    <a
      href={disabled ? undefined : href}
      className={`block p-6 rounded-xl shadow border transition ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg hover:border-black"
      }`}
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </a>
  );
}
