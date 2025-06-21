import express, { Application, Request, Response } from "express";

import dotenv from "dotenv";
import { booksRoutes } from "./app/controllers/book.controller";

const app: Application = express();

app.use(express.json());
// middleware
dotenv.config();

app.use("/api", booksRoutes);
// app.use("/users", usersRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library maintenances App");
});

export default app;

// mvc - model  , controller
