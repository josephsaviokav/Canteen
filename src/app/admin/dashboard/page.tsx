export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Canteen Details</h2>
          <p className="text-gray-600">Canteen Name: TBD</p>
          <p className="text-gray-600">Location: TBD</p>
          <p className="text-gray-600">Canteen ID: TBD</p>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-2">Admin Info</h2>
          <p className="text-gray-600">Role: Admin</p>
          <p className="text-gray-600">More details coming soon</p>
        </div>
      </div>
    </div>
  );
}
