import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { MOCK_PRODUCTS, MOCK_CUSTOMERS } from "../constants";

dotenv.config({ path: ".env.local" });

(async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("❌ Missing MONGODB_URI in .env.local");
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    console.log("✅ Connected successfully to MongoDB");

    const db = client.db("devrang");

    // Seed Products
    const productsCollection = db.collection("products");
    await productsCollection.createIndex({ id: 1 }, { unique: true });

    for (const product of MOCK_PRODUCTS) {
      const exists = await productsCollection.findOne({ id: product.id });
      if (!exists) {
        await productsCollection.insertOne({
          ...product,
          createdAt: new Date(),
          updatedAt: new Date(),
          isDeleted: false,
        });
        console.log(`✅ Inserted product: ${product.name}`);
      } else {
        console.log(`⚠️ Skipped existing product: ${product.name}`);
      }
    }

    // Seed Customers
    const customersCollection = db.collection("customers");
    await customersCollection.createIndex({ id: 1 }, { unique: true });

    for (const customer of MOCK_CUSTOMERS) {
      const exists = await customersCollection.findOne({ id: customer.id });
      if (!exists) {
        await customersCollection.insertOne({
          ...customer,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        console.log(`✅ Inserted customer: ${customer.name}`);
      } else {
        console.log(`⚠️ Skipped existing customer: ${customer.name}`);
      }
    }

    console.log("🎉 Database seeding complete!");
    await client.close();
    console.log("🔒 MongoDB connection closed.");
  } catch (err) {
    console.error("❌ MongoDB seeding failed:", err);
  }
})();
