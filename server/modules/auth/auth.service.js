import { User } from "./auth.model.js";
import { signAccessToken, signRefreshToken, hashToken, verifyToken } from "./auth.tokens.js";
import { AppError } from "../../shared/errors/AppError.js";

export const issueTokenPair = async (userId, role) => {
    const accessToken = signAccessToken(userId, role);
    const { token: refreshToken, jti } = signRefreshToken(userId);

    await User.findByIdAndUpdate(userId, {
        refreshTokenHash: hashToken(jti),
    });

    return { accessToken, refreshToken }; 
};

export const rotateRefreshToken = async (incomingToken) => {
    let payload;
    try {
        payload = verifyToken(incomingToken, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        throw new AppError("Invalid or expired refresh token", 401);
    }

    const user = await User.findById(payload.sub);
    if(!user) throw new AppError("User not found", 401);

    const expectedHash = hashToken(payload.jti);
    if(user.refreshTokenHash !== expectedHash) {
        await User.findByIdAndUpdate(payload.sub, { refreshTokenHash: null });
        throw new AppError(" Token reuse detected. Please login again.", 401);
    }

    return issueTokenPair(user._id, user.role);
};

export const revokeRefreshToken = async (userId) => {
    await User.findByIdAndUpdate(userId, { refreshTokenHash: null });
}