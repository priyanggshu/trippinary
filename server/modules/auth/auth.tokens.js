import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signAccessToken = (userId, role) => {
  return jwt.sign({ sub: userId, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
};

export const signRefreshToken = (userId) => {
  const jti = crypto.randomBytes(16).toString("hex");
  const token = jwt.sign(
    { sub: userId, jti },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN },
  );
  return { token, jti };
};

export const hashToken = (value) => {
  return crypto.createHash("sha256").update(value).digest("hex");
};

export const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

export const setRefreshCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "strict" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken");
};
