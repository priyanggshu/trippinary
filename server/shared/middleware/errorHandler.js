import { AppError } from "../errors/AppError.js";

const handleCastError = (err) =>
  new AppError(`Invalid ${err.path}: ${err.value}`, 400);

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  return new AppError(`${field} already exists`, 409);
};

const handleValidationError = (err) => {
    const messages = Object.values(err.errors).map((e) => e.message);
    return new AppError(`Validation failed: ${messages.join(", ")}`, 400);
};

const handleJWTError = () => new AppError("Invalid token. Please login again", 401);

const handleJWTExpiredError = () => new AppError("Your session has expired. Please login again", 401);

export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Something went wrong";

    if(err.name === "CastError") err = handleCastError(err);
    if(err.code === 11000) err = handleDuplicateKeyError(err);
    if(err.name === "ValidationError") err = handleValidationError(err);
    if(err.name === "JsonWebTokenError") err = handleJWTError(err);
    if(err.name === "TokenExpiredError") err = handleJWTExpiredError(err);

    if (process.env.NODE_ENV === "development") {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err,
        })
    }

    if (err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    console.error("PROGRAMMER ERROR: ", err);
    return res.status(500).json({
        success: false,
        message: "Something went wrong. Please try again."
    })
};