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

app.delete("/business/:id", async (req: Request, res: Response) => {
  const { id } = req.params
  const deleteBusinesses = await prisma.business.delete({
    where: { id, },
    include: {
      locations: true,
    }
  });
  res.json(deleteBusinesses);
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
