"use client";

import { useAuth } from "@/contexts/AuthContext";

export default function UserDashboardPage() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-white">Welcome back, {user.firstName}! 👋</h1>
        <p className="text-green-50 text-sm mt-2">
          Manage your profile, track your orders, and more
        </p>
      </div>

      {/* Profile Information */}
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Account Information
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <InfoRow label="Full Name" value={user.firstName + " " + user.lastName} />
          <InfoRow label="Email Address" value={user.email} />
          {user.phone && <InfoRow label="Phone" value={user.phone} />}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ActionCard
            title="View Profile"
            description="Edit your personal details"
            href="/user/profile"
            icon="profile"
          />
          <ActionCard
            title="View Orders"
            description="Track, cancel or refund orders"
            href="/user/orders"
            icon="orders"
          />
          <ActionCard
            title="Security"
            description="Change password & settings"
            href="#"
            disabled
            icon="security"
          />
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col space-y-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="font-medium text-gray-900 text-base">{value}</span>
    </div>
  );
}

function ActionCard({
  title,
  description,
  href,
  disabled,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  disabled?: boolean;
  icon?: string;
}) {
  const getIcon = () => {
    switch (icon) {
      case "profile":
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case "orders":
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        );
      case "security":
        return (
          <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <a
      href={disabled ? undefined : href}
      className={`block p-6 rounded-xl shadow-md border border-gray-100 transition-all bg-white ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : "hover:shadow-lg hover:border-green-500 hover:-translate-y-1"
      }`}
    >
      <div className="mb-4">{getIcon()}</div>
      <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
      <p className="text-sm text-gray-600 mt-2">{description}</p>
      {!disabled && (
        <div className="mt-4 text-green-500 text-sm font-medium flex items-center">
          Learn more
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </a>
  );
}
