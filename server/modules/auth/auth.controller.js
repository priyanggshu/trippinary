import {
  issueTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
} from "./auth.service.js";
import { setRefreshCookie, clearRefreshCookie } from "./auth.tokens.js";
import { AppError } from "../../shared/errors/AppError.js";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";

export const handleOauthCallback = asyncHandler(async (req, res) => {
    const { accessToken, refreshToken } = await issueTokenPair(
        req.user._id,
        req.user.role
    );

    setRefreshCookie(res, refreshToken);
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/callback`);
    redirectUrl.searchParams.set("token", accessToken);
    res.redirect(redirectUrl.toString());
});

export const refresh = asyncHandler(async (req, res) => {
    const incommingToken = req.cookies?.refreshToken;
    if(!incommingToken) throw new AppError("No refresh token", 401);

    const { accessToken, refreshToken } = await rotateRefreshToken(incommingToken);
    setRefreshCookie(res, refreshToken);

    res.json({success: true, accessToken});
});

export const logout = asyncHandler(async (req, res) => {
    await revokeRefreshToken(req.user.id);
    clearRefreshCookie(res);
    res.json({ success: true, message: "Logged out" });
});

export const getMe = asyncHandler(async (req, res) => {
    res.json({ success: true, user: req.user });
});