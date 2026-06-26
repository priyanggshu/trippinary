import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import passport from "passport";

import { errorHandler } from "./shared/middleware/errorHandler.js";
import { configurePassport } from "./modules/auth/auth.passport.js";
import authRouter from "./modules/auth/auth.routes.js";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
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
  })
);

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configurePassport();
app.use(passport.initialize());

app.get("/health", (_req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/auth", authRouter);

app.use(errorHandler);