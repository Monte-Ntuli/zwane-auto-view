import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Unsplash direct image URLs — no API key needed, reliably hosted
const VEHICLES = [
  {
    make: "Toyota",
    model: "Hilux 2.8 GD-6 RB Legend",
    year: 2022,
    price: 649900,
    mileage: 38000,
    fuelType: "Diesel",
    transmission: "Automatic",
    color: "White",
    engine: "2.8L GD-6 Turbodiesel",
    description:
      "One owner. Full Toyota service history. Tow bar fitted, canopy included. Never off-road. Comes with spare key and all original documents.",
    featured: true,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
      "https://images.unsplash.com/photo-1581829539565-d6936b77ab6c?w=800&q=80",
      "https://images.unsplash.com/photo-1611016186353-9af58c69a533?w=800&q=80",
    ],
  },
  {
    make: "BMW",
    model: "3 Series 320d M Sport",
    year: 2021,
    price: 579000,
    mileage: 52000,
    fuelType: "Diesel",
    transmission: "Automatic",
    color: "Black",
    engine: "2.0L B47 Turbodiesel",
    description:
      "Stunning M Sport package with full leather interior, sunroof, and BMW Connected Drive. Dealer maintained with full BMW service history. Excellent condition inside and out.",
    featured: true,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
      "https://images.unsplash.com/photo-1541443131876-44b03de101c5?w=800&q=80",
      "https://images.unsplash.com/photo-1617469767-f9f4e8acb1b3?w=800&q=80",
    ],
  },
  {
    make: "Volkswagen",
    model: "Polo Vivo 1.4 Trendline",
    year: 2023,
    price: 219900,
    mileage: 12500,
    fuelType: "Petrol",
    transmission: "Manual",
    color: "Silver",
    engine: "1.4L MPI",
    description:
      "Virtually new — driven by a single owner since new. Still under balance of VW factory warranty. Perfect city car with low running costs. Ideal first car.",
    featured: true,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80",
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    ],
  },
  {
    make: "Ford",
    model: "Ranger 3.2 TDCi Wildtrak 4x4",
    year: 2020,
    price: 545000,
    mileage: 78000,
    fuelType: "Diesel",
    transmission: "Automatic",
    color: "Grey",
    engine: "3.2L TDCi Duratorq",
    description:
      "Double cab in great shape. Nudge bar, running boards, and roller shutter fitted. Full Ford service history up to 75 000 km. Excellent towing capacity, ready for work or play.",
    featured: false,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800&q=80",
      "https://images.unsplash.com/photo-1518987048-93e29699e79a?w=800&q=80",
    ],
  },
  {
    make: "Hyundai",
    model: "Tucson 2.0 Executive",
    year: 2022,
    price: 389000,
    mileage: 29000,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Blue",
    engine: "2.0L Nu MPI",
    description:
      "Family SUV in pristine condition. Panoramic sunroof, Apple CarPlay, blind spot detection, and reverse camera. Two years remaining on Hyundai 5-year warranty.",
    featured: true,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800&q=80",
      "https://images.unsplash.com/photo-1543796076-c8a8cf5d0e23?w=800&q=80",
    ],
  },
  {
    make: "Mercedes-Benz",
    model: "C 200 Avantgarde",
    year: 2019,
    price: 489000,
    mileage: 91000,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "White",
    engine: "2.0L M264 Turbo",
    description:
      "Immaculate executive sedan. Leather interior, MBUX infotainment, ambient lighting, and parking assist. Freshly serviced. All service records available. A rare find at this price.",
    featured: false,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80",
      "https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=800&q=80",
    ],
  },
  {
    make: "Kia",
    model: "Sportage 2.0 EX",
    year: 2021,
    price: 349000,
    mileage: 44000,
    fuelType: "Petrol",
    transmission: "Automatic",
    color: "Red",
    engine: "2.0L MPI",
    description:
      "Well-maintained crossover with full Kia service history. Includes heated seats, 7-inch touchscreen, and rear park sensors. 1-year remaining on factory warranty. Non-smoker vehicle.",
    featured: false,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
    ],
  },
  {
    make: "Nissan",
    model: "NP300 Hardbody 2.5 TDi HiRider",
    year: 2021,
    price: 319900,
    mileage: 61000,
    fuelType: "Diesel",
    transmission: "Manual",
    color: "White",
    engine: "2.5L YD25 Turbodiesel",
    description:
      "Workhorse bakkie in excellent condition. One fleet owner, serviced every 10 000 km. Bull bar and spray-on liner fitted. Reliable and economical — ideal for business use.",
    featured: false,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    ],
  },
  {
    make: "Audi",
    model: "A4 2.0 TDI S Line",
    year: 2018,
    price: 349000,
    mileage: 112000,
    fuelType: "Diesel",
    transmission: "Automatic",
    color: "Grey",
    engine: "2.0L EA288 Turbodiesel",
    description:
      "Premium S Line spec with 19\" alloys, virtual cockpit, full leather, and matrix LED headlights. Higher mileage is reflected in the price — mechanically sound with full service history.",
    featured: false,
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80",
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&q=80",
    ],
  },
  {
    make: "Toyota",
    model: "Fortuner 2.8 GD-6 4x4 VX",
    year: 2020,
    price: 699000,
    mileage: 67000,
    fuelType: "Diesel",
    transmission: "Automatic",
    color: "Brown",
    engine: "2.8L 1GD-FTV Turbodiesel",
    description:
      "Top-spec VX model with leather, sunroof, and 7-seat configuration. Nudge bar and running boards fitted. Full Toyota service history. Popular family 4x4 in excellent order.",
    featured: true,
    status: "sold",
    images: [
      "https://images.unsplash.com/photo-1547636780-a2a6e3b4a0c2?w=800&q=80",
      "https://images.unsplash.com/photo-1571127236794-81c0bbfe1ce3?w=800&q=80",
    ],
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  await prisma.image.deleteMany();
  await prisma.vehicle.deleteMany();
  console.log("   Cleared existing vehicles.");

  const existing = await prisma.admin.findFirst();
  if (!existing) {
    const hashed = await bcrypt.hash(
      process.env.ADMIN_PASSWORD || "Admin@ZwaneAuto2024",
      12
    );
    await prisma.admin.create({
      data: {
        email: process.env.ADMIN_EMAIL || "admin@zwaneautoview.co.za",
        password: hashed,
      },
    });
    console.log("   Created admin account.");
  }

  for (const v of VEHICLES) {
    const { images, ...vehicleData } = v;
    await prisma.vehicle.create({
      data: {
        ...vehicleData,
        images: {
          create: images.map((url, i) => ({ url, isPrimary: i === 0 })),
        },
      },
    });
    console.log(`   ✓ ${v.year} ${v.make} ${v.model}`);
  }

  console.log(`\n✅ Done! Seeded ${VEHICLES.length} vehicles.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
