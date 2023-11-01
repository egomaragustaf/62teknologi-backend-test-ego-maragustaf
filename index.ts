import { PrismaClient } from "@prisma/client";
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const app: Express = express();
const port = process.env.PORT;

app.get("/business", (req: Request, res: Response) => {
  res.send("This is Yelp Clone");
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

app.get("/business/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const businessId = await prisma.business.findUnique({
    where: { id },
    include: {
      locations: true,
    },
  });
  res.json(businessId);
});

// Add data without form
app.post("/business/add", async (req: Request, res: Response) => {
  const addBusinesses = await prisma.business.create({
    data: {
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
    },
  });
  res.json(addBusinesses);
});

app.delete("/business/:id/delete", async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleteBusinesses = await prisma.business.delete({
    where: { id },
  });
  res.json(deleteBusinesses);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
