import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminInventory from "@/components/AdminInventory";

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const [total, available, sold] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: "available" } }),
    prisma.vehicle.count({ where: { status: "sold" } }),
  ]);

  const vehicles = await prisma.vehicle.findMany({
    include: { images: { where: { isPrimary: true } } },
    orderBy: { createdAt: "desc" },
  });

  const stats = [
    { label: "Total Listings", value: total, color: "blue" },
    { label: "Available", value: available, color: "green" },
    { label: "Sold", value: sold, color: "red" },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Top Bar */}
      <div className="bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
            </svg>
          </div>
          <span className="font-semibold text-sm">Zwane Auto View — Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-slate-400 hover:text-white text-xs transition-colors">
            View Site
          </Link>
          <Link href="/api/auth/signout" className="text-slate-400 hover:text-red-400 text-xs transition-colors">
            Sign Out
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, color }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm text-slate-500 mb-1">{label}</p>
              <p className={`text-3xl font-extrabold text-${color}-600`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Add New button */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-slate-900">Manage Inventory</h1>
          <Link
            href="/admin/vehicles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Vehicle
          </Link>
        </div>

        {/* Inventory table */}
        <AdminInventory initialVehicles={JSON.parse(JSON.stringify(vehicles))} />
      </div>
    </div>
  );
}
