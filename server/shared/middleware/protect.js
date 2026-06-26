import { verifyToken } from "../../modules/auth/auth.tokens.js";
import { User } from "../../modules/auth/auth.model.js";
import { AppError } from "../errors/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Authentication required", 401);
  }

  const token = authHeader.split(" ")[1];

  let payload;
  try {
    payload = verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
  } catch {
    throw new AppError("Invalid or expired access token", 401);
  }

  const user = await User.findById(payload.sub).select("-refreshTokenHash");
  if (!user) throw new AppError("User no longer exists", 401);

  req.user = user;
  next();
});

export const requireRole = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new AppError("You do not have permission to perform this action", 403);
  }
  next();
};