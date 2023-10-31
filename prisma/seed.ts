import { PrismaClient } from "@prisma/client";
import dataBusinesses from "./businesses.json";

const prisma = new PrismaClient();

async function main() {
  await prisma.business.deleteMany();
  
  await prisma.businessLocation.deleteMany();

  for (const business of dataBusinesses) {
    const locations = business.location

    const businesses = await prisma.business.create({
      data: {
        alias: business.alias,
        name: business.name,
        is_closed: business.is_closed,
        review_count: business.review_count,
        rating: business.rating,
        price: business.price,
        locations: {
          create: {
            address1: locations.address1,
            address2: locations.address2,
            city: locations.city,
            zip_code: locations.zip_code,
            country: locations.country,
            state: locations.state,
          },
        },
        }
      });

    console.log("✅ Seeded data:", businesses);
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
