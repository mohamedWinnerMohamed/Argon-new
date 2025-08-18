import { PrismaClient } from "@prisma/client";

import crypto from "crypto";

// Generate a unique ID
function generateUniqueCode(length = 8) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}

const prisma = new PrismaClient();

async function main() {
  const data = new Array(35).fill(null).map((_, index) => ({
    fullName: `Passenger ${index + 1}`,
    passportNo: "PA45686",
    destination: "مكان ما",
    code: generateUniqueCode(8),
    phone: "+20104464684",
    seatNo: index + 1,
    tripId: "677d33fe0fc58ef82aeeb0ed",
    officeId: "677c4cb3dcbfbca392294f74",
  }));

  // Seed Posts
  await prisma.passenger.createMany({
    data,
  });

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
