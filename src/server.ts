import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";

let server: Server;

const PORT = process.env.PORT || 5000;
async function main() {
  try {
    await mongoose.connect(`${process.env.DB_URL}`);
    console.log("Connected to MongoDB Using Mongoose!!");
    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
