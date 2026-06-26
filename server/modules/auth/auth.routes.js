import { Router } from "express";
import passport from "passport";
import {
  handleOauthCallback,
  refresh,
  logout,
  getMe,
} from "./auth.controller.js";

import { protect } from "../../shared/middleware/protect.js";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
  }),
);
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/auth/failure",
  }),
  handleOauthCallback
);

router.get("/failure", (_req, res)=> {
    res.status(401).json({ success: false, message: "Google authentication failed" });
});

router.post("/refresh", refresh);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

export default router;
