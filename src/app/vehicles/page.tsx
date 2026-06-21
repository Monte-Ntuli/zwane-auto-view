import { Suspense } from "react";
import VehicleCard from "@/components/VehicleCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import { Vehicle } from "@/types";

async function getVehicles(searchParams: Record<string, string>): Promise<Vehicle[]> {
  const params = new URLSearchParams({ status: "available", ...searchParams });
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/vehicles?${params}`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const params = await searchParams;
  const vehicles = await getVehicles(params);
  const hasFilters = Object.keys(params).some((k) => k !== "status");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900">Browse Vehicles</h1>
        <p className="text-slate-500 mt-1 text-sm">
          {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} available
          {hasFilters && " matching your search"}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
        <h2 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </h2>
        <Suspense>
          <SearchFilterBar compact />
        </Suspense>
      </div>

      {/* Grid */}
      {vehicles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 text-slate-400">
          <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-lg font-semibold text-slate-500">No vehicles found</p>
          <p className="text-sm mt-1">
            {hasFilters ? "Try adjusting your filters." : "Check back soon for new listings."}
          </p>
        </div>
      )}
    </div>
  );
}
