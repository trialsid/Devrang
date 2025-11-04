import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

(async () => {
  try {
    const client = new MongoClient(process.env.MONGODB_URI!);
    await client.connect();
    console.log("✅ Connected successfully to MongoDB");
    await client.close();
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
})();
