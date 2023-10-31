import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("This is Yelp Clone");
});

app.post("/business/add", async (req: Request, res: Response) => {
  try {
    const addBusinessData = {
      alias: "delicious-eats-chicago",
      name: "Delicious Eats",
      is_closed: false,
      review_count: 1500,
      rating: 4.0,
      price: "$$$",
      locations: {
        create: {
          address1: "456 Elm St",
          address2: "Suite 200",
          city: "Chicago",
          zip_code: "60601",
          country: "US",
          state: "IL",
        },
      },
    };

    const addBusiness = await prisma.business.create({
      data: addBusinessData,
    });

    res.json(addBusiness);
  } catch (error) {
    console.error("Error adding business:", error);
    res.status(500).json({ error: "Failed to add business" });
  }
});


app.get("/business/search", async (req: Request, res: Response) => {
  const businesses = await prisma.business.findMany({
    take: 15,
    include: {
      locations: true,
    },
  });
  res.json(businesses);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
