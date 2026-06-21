import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seedAdmin } from "@/lib/seed";

export async function GET(req: NextRequest) {
  await seedAdmin();

  const { searchParams } = new URL(req.url);
  const make = searchParams.get("make");
  const model = searchParams.get("model");
  const maxPrice = searchParams.get("maxPrice");
  const minYear = searchParams.get("minYear");
  const maxYear = searchParams.get("maxYear");
  const fuelType = searchParams.get("fuelType");
  const transmission = searchParams.get("transmission");
  const status = searchParams.get("status") || "available";
  const featured = searchParams.get("featured");

  const vehicles = await prisma.vehicle.findMany({
    where: {
      ...(make && { make: { contains: make } }),
      ...(model && { model: { contains: model } }),
      ...(maxPrice && { price: { lte: parseFloat(maxPrice) } }),
      ...(minYear && { year: { gte: parseInt(minYear) } }),
      ...(maxYear && { year: { lte: parseInt(maxYear) } }),
      ...(fuelType && { fuelType }),
      ...(transmission && { transmission }),
      ...(status !== "all" && { status }),
      ...(featured === "true" && { featured: true }),
    },
    include: { images: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(vehicles);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { images, ...vehicleData } = body;

  const vehicle = await prisma.vehicle.create({
    data: {
      ...vehicleData,
      images: {
        create: images?.map((url: string, i: number) => ({
          url,
          isPrimary: i === 0,
        })) || [],
      },
    },
    include: { images: true },
  });

  return NextResponse.json(vehicle, { status: 201 });
}
