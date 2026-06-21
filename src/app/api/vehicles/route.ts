import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Vehicle } from "@/types";
import dummyVehicles from "../../../../dummy-data/vehicles.json";

// DEMO MODE — reads from dummy-data/vehicles.json instead of the database.
// Delete the dummy-data folder and restore the prisma imports when connecting Supabase.

function applyFilters(vehicles: Vehicle[], params: URLSearchParams): Vehicle[] {
  const make = params.get("make");
  const model = params.get("model");
  const maxPrice = params.get("maxPrice");
  const minYear = params.get("minYear");
  const fuelType = params.get("fuelType");
  const transmission = params.get("transmission");
  const status = params.get("status") || "available";
  const featured = params.get("featured");

  return vehicles.filter((v) => {
    if (make && !v.make.toLowerCase().includes(make.toLowerCase())) return false;
    if (model && !v.model.toLowerCase().includes(model.toLowerCase())) return false;
    if (maxPrice && v.price > parseFloat(maxPrice)) return false;
    if (minYear && v.year < parseInt(minYear)) return false;
    if (fuelType && v.fuelType !== fuelType) return false;
    if (transmission && v.transmission !== transmission) return false;
    if (status !== "all" && v.status !== status) return false;
    if (featured === "true" && !v.featured) return false;
    return true;
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const vehicles = applyFilters(dummyVehicles as Vehicle[], searchParams);
  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // Write operations are disabled in demo mode
  return NextResponse.json(
    { error: "Demo mode — database not connected yet." },
    { status: 503 }
  );
}
