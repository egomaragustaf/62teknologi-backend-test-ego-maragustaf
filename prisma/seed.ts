import { PrismaClient } from "@prisma/client";
import dataBusinesses from "./businesses.json";

const prisma = new PrismaClient();

async function main() {
  for (const business of dataBusinesses) {
    const newBusinesses = await prisma.business.create({
      data: {
        alias: business.alias,
        name: business.name,
        is_closed: business.is_closed,
        review_count: business.review_count,
        rating: business.rating,
        price: business.price,
        locations: {
            create: business.location
          }
        },
        include: {
          locations: true
        }
      });

    console.log("✅ Seeded data:", newBusinesses);
  }
}

main()
  .then(async () => {
    console.log("✅ Seeding complete");
    await prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    console.log("❌ Seeding failed");
    prisma.$disconnect();
    process.exit(1);
  });
