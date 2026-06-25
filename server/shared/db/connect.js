import mongoose from "mongoose";

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");
};

process.on("SIGTERM", async () => {
  console.log("SIGTERM received - shutting down gracefully");
  await mongoose.disconnect();
  process.exit(0);
});

export default connectDB;
