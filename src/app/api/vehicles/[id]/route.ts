import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Vehicle } from "@/types";
import dummyVehicles from "../../../../../dummy-data/vehicles.json";

// DEMO MODE — reads from dummy-data/vehicles.json instead of the database.
// Delete the dummy-data folder and restore the prisma imports when connecting Supabase.

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const vehicle = (dummyVehicles as Vehicle[]).find((v) => v.id === id);

  if (!vehicle) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const sorted = {
    ...vehicle,
    images: [...vehicle.images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0)),
  };

  return NextResponse.json(sorted);
}

export async function PATCH(
  _req: NextRequest,
  { params: _params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { error: "Demo mode — database not connected yet." },
    { status: 503 }
  );
}

export async function DELETE(
  _req: NextRequest,
  { params: _params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json(
    { error: "Demo mode — database not connected yet." },
    { status: 503 }
  );
}
