import { notFound } from "next/navigation";
import Link from "next/link";
import ImageGallery from "@/components/ImageGallery";
import InquireSection from "@/components/InquireSection";
import { Vehicle } from "@/types";

async function getVehicle(id: string): Promise<Vehicle | null> {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/vehicles/${id}`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatMileage(km: number) {
  return new Intl.NumberFormat("en-ZA").format(km) + " km";
}

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const vehicle = await getVehicle(id);
  if (!vehicle) notFound();

  const specs = [
    { label: "Year", value: vehicle.year },
    { label: "Make", value: vehicle.make },
    { label: "Model", value: vehicle.model },
    { label: "Mileage", value: formatMileage(vehicle.mileage) },
    { label: "Fuel Type", value: vehicle.fuelType },
    { label: "Transmission", value: vehicle.transmission },
    ...(vehicle.engine ? [{ label: "Engine", value: vehicle.engine }] : []),
    ...(vehicle.color ? [{ label: "Colour", value: vehicle.color }] : []),
    { label: "Status", value: vehicle.status === "sold" ? "Sold" : "Available" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/vehicles" className="hover:text-blue-600 transition-colors">Vehicles</Link>
        <span>/</span>
        <span className="text-slate-800 font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Gallery + Details */}
        <div className="lg:col-span-2 space-y-6">
          <ImageGallery images={vehicle.images} />

          {/* Title + Price */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </h1>
                {vehicle.status === "sold" && (
                  <span className="inline-block mt-2 bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                    SOLD
                  </span>
                )}
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-blue-600">{formatPrice(vehicle.price)}</p>
                {vehicle.status === "available" && (
                  <p className="text-xs text-green-600 font-medium mt-1">✓ Available Now</p>
                )}
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="text-base font-bold text-slate-900 mb-4">Vehicle Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-px bg-gray-100 rounded-xl overflow-hidden border border-gray-100">
              {specs.map(({ label, value }) => (
                <div key={label} className="bg-white p-3.5">
                  <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-slate-800">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="text-base font-bold text-slate-900 mb-3">Description</h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">{vehicle.description}</p>
            </div>
          )}
        </div>

        {/* Right: Inquiry */}
        <div className="lg:col-span-1">
          <div className="sticky top-20 space-y-4">
            <InquireSection vehicle={vehicle} />

            {/* Back link */}
            <Link
              href="/vehicles"
              className="flex items-center justify-center gap-2 w-full border border-gray-200 text-slate-600 hover:bg-gray-50 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to All Vehicles
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
