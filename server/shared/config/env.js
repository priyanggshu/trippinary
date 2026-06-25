const requiredEnv = [ "PORT", "MONGO_URI", "NODE_ENV", "REFRESH_TOKEN_EXPIRES_IN", "CLIENT_URL" ];
requiredEnv.forEach((key) => {
  if (!process.env[key]) throw new Error(`Missing env variable: ${key}`);
});

export const env = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV || "development",
  REFRESH_TOKEN_EXPIRES_IN: process.env.REFRESH_TOKEN_EXPIRES_IN,
  CLIENT_URL: process.env.CLIENT_URL,
};
