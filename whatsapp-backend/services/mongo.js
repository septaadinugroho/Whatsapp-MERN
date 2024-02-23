import mongoose from "mongoose";
import "dotenv/config";
//dotenv.config();

const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDB connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

// export async function mongoConnect() {
//   await mongoose.connect(MONGO_URL);
// }

export async function mongoConnect() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("MongoDB connected successfully!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error; // Mengembalikan error agar dapat ditangkap di tempat lain
  }
}

export async function mongoDisconnect() {
  await mongoose.disconnect();
}
