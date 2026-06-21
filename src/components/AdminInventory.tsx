"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Vehicle } from "@/types";

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function AdminInventory({ initialVehicles }: { initialVehicles: Vehicle[] }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this vehicle?")) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/vehicles/${id}`, { method: "DELETE" });
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v.id !== id));
      }
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleSold = async (vehicle: Vehicle) => {
    const newStatus = vehicle.status === "sold" ? "available" : "sold";
    setUpdatingId(vehicle.id);
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? updated : v)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  const handleToggleFeatured = async (vehicle: Vehicle) => {
    setUpdatingId(vehicle.id);
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !vehicle.featured }),
      });
      if (res.ok) {
        const updated = await res.json();
        setVehicles((prev) => prev.map((v) => (v.id === vehicle.id ? updated : v)));
      }
    } finally {
      setUpdatingId(null);
    }
  };

  if (!vehicles.length) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
        <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
        </svg>
        <p className="text-slate-500 font-medium">No vehicles yet</p>
        <Link href="/admin/vehicles/new" className="mt-3 inline-block text-blue-600 text-sm font-medium hover:underline">
          Add your first vehicle →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Vehicle</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Price</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Featured</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {vehicles.map((vehicle) => {
              const img = vehicle.images[0];
              const isDisabled = deletingId === vehicle.id || updatingId === vehicle.id;
              return (
                <tr key={vehicle.id} className={`hover:bg-gray-50 transition-colors ${isDisabled ? "opacity-60" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        {img ? (
                          <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{vehicle.year} {vehicle.make} {vehicle.model}</p>
                        <p className="text-xs text-slate-400">{vehicle.mileage.toLocaleString()} km • {vehicle.transmission}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-blue-600">{formatPrice(vehicle.price)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${
                      vehicle.status === "sold"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}>
                      {vehicle.status === "sold" ? "Sold" : "Available"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleFeatured(vehicle)}
                      disabled={isDisabled}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
                        vehicle.featured
                          ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          : "bg-gray-100 text-slate-400 hover:bg-gray-200"
                      }`}
                    >
                      {vehicle.featured ? "★ Featured" : "☆ Feature"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/vehicles/${vehicle.id}`}
                        className="text-xs text-slate-500 hover:text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleToggleSold(vehicle)}
                        disabled={isDisabled}
                        className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 px-2.5 py-1 rounded-lg transition-colors disabled:cursor-not-allowed"
                      >
                        {vehicle.status === "sold" ? "Relist" : "Mark Sold"}
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle.id)}
                        disabled={isDisabled}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-2.5 py-1 rounded-lg transition-colors disabled:cursor-not-allowed"
                      >
                        {deletingId === vehicle.id ? "..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden divide-y divide-gray-100">
        {vehicles.map((vehicle) => {
          const img = vehicle.images[0];
          const isDisabled = deletingId === vehicle.id || updatingId === vehicle.id;
          return (
            <div key={vehicle.id} className={`p-4 ${isDisabled ? "opacity-60" : ""}`}>
              <div className="flex gap-3 mb-3">
                <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {img && <Image src={img.url} alt="" fill className="object-cover" sizes="64px" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm truncate">
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </p>
                  <p className="text-blue-600 font-bold text-sm">{formatPrice(vehicle.price)}</p>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mt-1 ${
                    vehicle.status === "sold" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                  }`}>
                    {vehicle.status === "sold" ? "Sold" : "Available"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleSold(vehicle)}
                  disabled={isDisabled}
                  className="flex-1 text-xs bg-amber-50 text-amber-700 py-2 rounded-lg"
                >
                  {vehicle.status === "sold" ? "Relist" : "Mark Sold"}
                </button>
                <button
                  onClick={() => handleDelete(vehicle.id)}
                  disabled={isDisabled}
                  className="flex-1 text-xs bg-red-50 text-red-600 py-2 rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
