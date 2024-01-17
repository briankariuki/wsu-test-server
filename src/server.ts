import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import UserService from "./services/user";
import { initDb } from "./mongoose";
import { FilterQuery } from "mongoose";
import { User } from "./models/user";

async function serve(): Promise<void> {
  dotenv.config();

  const app: Express = express();
  const port = process.env.PORT || 3000;

  await initDb();

  app.use(express.json());
  app.use(express.urlencoded());

  const userService = new UserService();

  app.get("/", (req: Request, res: Response) => {
    res.json({ body: "I'm alive" });
  });

  app.get("/api/healthcheck", (req: Request, res: Response) => {
    res.json({
      healthcheck: {
        message: "The Api is fully functional",
        date: new Date().toISOString(),
        status: "active",
      },
    });
  });

  app.post("/v1/user", async (req: Request, res: Response) => {
    const { displayName, email, phoneNumber } = req.body;

    const user = await userService.create({
      displayName: displayName,
      email: email,
      phoneNumber: phoneNumber,
    });
    res.json({ user: user });
  });

  app.put("/v1/user/:id", async (req: Request, res: Response) => {
    const { displayName, email, phoneNumber } = req.body;
    const userId = req.params["id"];

    const user = await userService.update(userId, {
      displayName: displayName,
      email: email,
      phoneNumber: phoneNumber,
    });
    res.json({ user: user });
  });

  app.delete("/v1/user/:id", async (req: Request, res: Response) => {
    const userId = req.params["id"];

    const user = await userService.delete({ userId: userId as string });
    res.json({ user: user });
  });

  app.get("/v1/user", async (req: Request, res: Response) => {
    const { userId, sort, page, limit, q, status } = req.query;

    if (userId) {
      const user = await userService.findById(userId as string);

      res.json({ user });

      return;
    }

    let query: FilterQuery<User> = {};

    if (status) query = { ...query, ...{ status } };
    query = { ...query, ...{ deleted: false } };

    if (q)
      query = { ...query, ...{ $text: { $search: (q as string).trim() } } };

    const userPage = await userService.page(query, { sort, page, limit });

    res.json({ userPage });
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
}

serve();
