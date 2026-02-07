export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Canteen Details</h2>
          <p className="text-gray-800">Canteen Name: TBD</p>
          <p className="text-gray-800">Location: TBD</p>
          <p className="text-gray-800">Canteen ID: TBD</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-900">Admin Info</h2>
          <p className="text-gray-800">Role: Admin</p>
          <p className="text-gray-800">More details coming soon</p>
        </div>
      </div>
    </div>
  );
}
