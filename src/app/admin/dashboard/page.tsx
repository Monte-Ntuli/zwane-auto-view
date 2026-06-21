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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin top bar */}
      <div className="bg-slate-900 text-white px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
            </svg>
          </div>
          <span className="font-semibold text-sm truncate">Zwane Auto View — Admin</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link href="/" className="text-slate-400 hover:text-white text-xs transition-colors">
            View Site
          </Link>
          <Link href="/api/auth/signout" className="text-slate-400 hover:text-red-400 text-xs transition-colors">
            Sign Out
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Stats — stack to single row on all screens, but use smaller text on mobile */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">Total</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">{total}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">Available</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-green-600">{available}</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3 sm:p-5">
            <p className="text-xs sm:text-sm text-slate-500 mb-1 truncate">Sold</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-red-600">{sold}</p>
          </div>
        </div>

        {/* Header row */}
        <div className="flex items-center justify-between gap-3 mb-5 sm:mb-6">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">Manage Inventory</h1>
          <Link
            href="/admin/vehicles/new"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-3 sm:px-5 py-2.5 rounded-xl flex items-center gap-1.5 transition-colors shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">Add New Vehicle</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>

        <AdminInventory initialVehicles={JSON.parse(JSON.stringify(vehicles))} />
      </div>
    </div>
  );
}
