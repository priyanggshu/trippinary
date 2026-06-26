import dotenv from "dotenv";
dotenv.config();

import "./shared/config/env.js";

import connectDB from "./shared/db/connect.js";
import { app } from "./app.js";

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT} [${process.env.NODE_ENV}]`)
  );
};

startServer();