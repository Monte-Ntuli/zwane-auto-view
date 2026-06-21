import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function seedAdmin() {
  const existing = await prisma.admin.findUnique({
    where: { email: process.env.ADMIN_EMAIL || "admin@zwaneautoview.co.za" },
  });
  if (existing) return;

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
}
