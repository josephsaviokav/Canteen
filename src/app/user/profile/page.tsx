"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

export default function UserProfilePage() {
  const { user, login } = useAuth();

  if (!user) return null;

  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);

    const updatedUser = {
      ...user,
      firstName,
      lastName,
      phone,
      // Email is not included - it's read-only
    };

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Update AuthContext
    login(updatedUser);

    setTimeout(() => {
      setSaving(false);
      alert("Profile updated");
    }, 500);
  };

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
        <div className="flex items-center mb-8">
          <div className="bg-green-100 p-3 rounded-lg">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div className="ml-4">
            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
            <p className="text-sm text-gray-600 mt-1">Update your personal information</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="Enter first name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                placeholder="Enter last name"
                required
              />
            </div>
          </div>

          {/* Email - Read Only */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                value={user.email}
                type="email"
                disabled
                className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 pr-10 text-gray-600 font-medium cursor-not-allowed"
              />
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <p className="text-xs text-gray-500 mt-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Email cannot be changed for security reasons
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              className="w-full border border-gray-300 bg-white rounded-lg px-4 py-3 text-gray-900 font-medium focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
              placeholder="Enter phone number (optional)"
            />
          </div>

          <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
            <button
              onClick={() => window.location.href = '/user/dashboard'}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-500 text-white px-8 py-3 rounded-lg hover:bg-green-600 disabled:opacity-60 font-medium transition flex items-center shadow-md"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
