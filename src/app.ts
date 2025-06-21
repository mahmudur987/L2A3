import express, { Application, NextFunction, Request, Response } from "express";

import dotenv from "dotenv";
import { booksRoutes } from "./app/controllers/book.controller";

const app: Application = express();

app.use(express.json());
// middleware
dotenv.config();

app.use("/api", booksRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to library maintenances App");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: `Route  not found`,
  });
});

app.use((err: any, req: Request, res: Response, next: NextFunction): any => {
  return res
    .status(500)
    .json({ success: false, message: "Something went wrong!" });
});

export default app;
