import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

dotenv.config();
import "./shared/config/env.js";

import connectDB from "./shared/db/connect.js";
import { errorHandler } from "./shared/middleware/errorHandler.js";
import { configurePassport } from "./modules/auth/auth.passport.js";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests, please try again later.",
    },
  }),
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configurePassport();
app.use(passport.initialize());

app.get("/health", (req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/auth", authRouter);

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  app.listen(process.env.PORT, () =>
    console.log(`Server running on port ${process.env.PORT}`),
  );
};

startServer();
