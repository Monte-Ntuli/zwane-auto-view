"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback } from "react";

const MAKES = ["Toyota", "BMW", "Mercedes-Benz", "Volkswagen", "Ford", "Nissan", "Honda", "Hyundai", "Kia", "Audi", "Mazda", "Chevrolet", "Suzuki", "Mitsubishi", "Renault"];
const FUEL_TYPES = ["Petrol", "Diesel", "Hybrid", "Electric"];
const TRANSMISSIONS = ["Manual", "Automatic"];
const YEARS = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

export default function SearchFilterBar({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(!compact);

  const [filters, setFilters] = useState({
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minYear: searchParams.get("minYear") || "",
    fuelType: searchParams.get("fuelType") || "",
    transmission: searchParams.get("transmission") || "",
  });

  const activeCount = Object.values(filters).filter(Boolean).length;

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
    router.push(`/vehicles?${params.toString()}`);
  }, [filters, router]);

  const handleReset = () => {
    setFilters({ make: "", model: "", maxPrice: "", minYear: "", fuelType: "", transmission: "" });
    if (compact) router.push("/vehicles");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const inputClass =
    "w-full bg-white border border-gray-200 text-slate-700 text-base rounded-xl px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className="space-y-3">
      {/* Compact toggle header */}
      {compact && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="w-full flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                {activeCount}
              </span>
            )}
          </span>
          <svg className={`w-4 h-4 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}

      {/* Filter fields */}
      {open && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <select
              value={filters.make}
              onChange={(e) => setFilters((f) => ({ ...f, make: e.target.value }))}
              className={inputClass}
            >
              <option value="">All Makes</option>
              {MAKES.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>

            <input
              type="text"
              placeholder="Model (e.g. Hilux)"
              value={filters.model}
              onChange={(e) => setFilters((f) => ({ ...f, model: e.target.value }))}
              onKeyDown={handleKeyDown}
              className={inputClass}
            />

            <input
              type="number"
              placeholder="Max Price (ZAR)"
              value={filters.maxPrice}
              onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
              onKeyDown={handleKeyDown}
              inputMode="numeric"
              className={inputClass}
            />

            <select
              value={filters.minYear}
              onChange={(e) => setFilters((f) => ({ ...f, minYear: e.target.value }))}
              className={inputClass}
            >
              <option value="">Min Year</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>

            <select
              value={filters.fuelType}
              onChange={(e) => setFilters((f) => ({ ...f, fuelType: e.target.value }))}
              className={inputClass}
            >
              <option value="">All Fuel Types</option>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>

            <select
              value={filters.transmission}
              onChange={(e) => setFilters((f) => ({ ...f, transmission: e.target.value }))}
              className={inputClass}
            >
              <option value="">All Transmissions</option>
              {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="flex gap-2">
            {activeCount > 0 && (
              <button
                onClick={handleReset}
                className="flex-none border border-gray-200 text-slate-500 hover:text-slate-700 hover:bg-gray-50 font-medium py-3 px-4 rounded-xl transition-colors text-sm"
              >
                Clear
              </button>
            )}
            <button
              onClick={handleSearch}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Vehicles
            </button>
          </div>
        </>
      )}
    </div>
  );
}
