import { Suspense } from "react";
import Link from "next/link";
import VehicleCard from "@/components/VehicleCard";
import SearchFilterBar from "@/components/SearchFilterBar";
import { Vehicle } from "@/types";

async function getFeaturedVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/vehicles?featured=true&status=available`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

async function getLatestVehicles(): Promise<Vehicle[]> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/vehicles?status=available`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

const STATS = [
  { value: "100%", label: "Verified" },
  { value: "ZAR", label: "Fair Pricing" },
  { value: "5★", label: "Trusted" },
];

export default async function Home() {
  const [featured, latest] = await Promise.all([getFeaturedVehicles(), getLatestVehicles()]);
  const displayVehicles = featured.length ? featured : latest.slice(0, 6);

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 md:py-28">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 sm:mb-6">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              South Africa&#39;s Trusted Auto Marketplace
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight mb-3 sm:mb-4">
              Find Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Perfect Car
              </span>
            </h1>
            <p className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed px-2 sm:px-0">
              Browse our handpicked selection of quality pre-owned vehicles. Every car is verified and priced fairly.
            </p>
          </div>

          {/* Search card */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 shadow-2xl">
            <p className="text-sm font-medium text-slate-300 mb-3 sm:mb-4 flex items-center gap-1.5">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter by your preferences
            </p>
            <Suspense>
              <SearchFilterBar />
            </Suspense>
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 sm:gap-16 mt-8 sm:mt-10">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-white">{value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
              {featured.length ? "Featured Vehicles" : "Latest Listings"}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              {latest.length} vehicle{latest.length !== 1 ? "s" : ""} available
            </p>
          </div>
          <Link
            href="/vehicles"
            className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 transition-colors shrink-0"
          >
            View All
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {displayVehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {displayVehicles.map((v) => (
              <VehicleCard key={v.id} vehicle={v} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <svg className="w-14 h-14 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0zM13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h10l2-2z" />
            </svg>
            <p className="font-semibold text-slate-500">No vehicles yet</p>
            <p className="text-sm mt-1">Check back soon — new listings added regularly.</p>
          </div>
        )}

        {displayVehicles.length > 0 && (
          <div className="text-center mt-8 sm:mt-10">
            <Link
              href="/vehicles"
              className="inline-flex items-center gap-2 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold px-6 sm:px-8 py-3 rounded-xl transition-colors text-sm"
            >
              Browse All Vehicles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        )}
      </section>

      {/* Why Us */}
      <section className="bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 text-center mb-8 sm:mb-10">
            Why Buy From Us?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Quality Assured",
                desc: "Every vehicle is carefully inspected and verified before listing.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                title: "Fair Pricing",
                desc: "Transparent, no-nonsense pricing. No hidden fees or surprises.",
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />,
                title: "WhatsApp Support",
                desc: "Get instant answers — chat directly with us on WhatsApp.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="flex sm:flex-col items-start sm:items-center gap-4 sm:gap-0 p-4 sm:p-6 rounded-2xl bg-gray-50 hover:bg-blue-50 transition-colors text-left sm:text-center">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0 sm:mb-4">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {icon}
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-1">{title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
