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

  const [filters, setFilters] = useState({
    make: searchParams.get("make") || "",
    model: searchParams.get("model") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    minYear: searchParams.get("minYear") || "",
    fuelType: searchParams.get("fuelType") || "",
    transmission: searchParams.get("transmission") || "",
  });

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    router.push(`/vehicles?${params.toString()}`);
  }, [filters, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const selectClass =
    "w-full bg-white border border-gray-200 text-slate-700 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  return (
    <div className={compact ? "space-y-3" : ""}>
      <div className={`grid gap-3 ${compact ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
        <select
          value={filters.make}
          onChange={(e) => setFilters((f) => ({ ...f, make: e.target.value }))}
          className={selectClass}
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
          className={selectClass}
        />

        <input
          type="number"
          placeholder="Max Price (ZAR)"
          value={filters.maxPrice}
          onChange={(e) => setFilters((f) => ({ ...f, maxPrice: e.target.value }))}
          onKeyDown={handleKeyDown}
          className={selectClass}
        />

        <select
          value={filters.minYear}
          onChange={(e) => setFilters((f) => ({ ...f, minYear: e.target.value }))}
          className={selectClass}
        >
          <option value="">Min Year</option>
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <select
          value={filters.fuelType}
          onChange={(e) => setFilters((f) => ({ ...f, fuelType: e.target.value }))}
          className={selectClass}
        >
          <option value="">All Fuel Types</option>
          {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          value={filters.transmission}
          onChange={(e) => setFilters((f) => ({ ...f, transmission: e.target.value }))}
          className={selectClass}
        >
          <option value="">All Transmissions</option>
          {TRANSMISSIONS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <button
        onClick={handleSearch}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search Vehicles
      </button>
    </div>
  );
}
