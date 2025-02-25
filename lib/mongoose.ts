import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URI) {
    throw new Error("Mongodb Uri is missing");
  }
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: "CodeSphere",
    });

    isConnected = true;
    console.log("Connected to database");
  } catch (error) {
    console.log("connection failed to mongodb", error);
  }
};
