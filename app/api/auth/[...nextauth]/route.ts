import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import clientPromise from "@/app/lib/mongodb";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise, { databaseName: "devrang" }),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",

  pages: {
    error: "/auth/error",
  },

  callbacks: {
    async signIn({ user }) {
      const client = await clientPromise;
      const db = client.db("devrang");

      const profile = await db
        .collection("user_profiles")
        .findOne({ email: user.email });

      // 🟡 First login → allow sign-in so createUser() can run
      if (!profile) {
        console.log("🟡 First time login → Allowing");
        return true;
      }

      // 🔥 Admin bypass
      if (profile.role === "admin") return true;

      // ❌ Block user until approved
      if (!profile.approved) {
        throw new Error("NOT_APPROVED");
      }

      return true;
    },

    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },

    async session({ session, token }) {
      if (token?.id && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  events: {
    async createUser({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("devrang");
        const profiles = db.collection("user_profiles");

        const existing = await profiles.findOne({ email: user.email });
        if (existing) return;

        const adminEmails =
          process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

        const isAdmin = adminEmails.includes(user.email ?? "");

        await profiles.insertOne({
          name: user.name || "",
          email: user.email,
          role: isAdmin ? "admin" : "user",
          approved: isAdmin ? true : false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        console.log(
          `✅ Created ${isAdmin ? "admin" : "user"} profile for ${user.email}`
        );
      } catch (err) {
        console.error("❌ Error creating user profile:", err);
      }
    },

    async signIn({ user }) {
      try {
        const client = await clientPromise;
        const db = client.db("devrang");

        await db
          .collection("user_profiles")
          .updateOne(
            { email: user.email },
            { $set: { updatedAt: new Date() } }
          );
      } catch (err) {
        console.error("⚠️ Error updating login timestamp:", err);
      }
    },
  },

  logger: {
    error(code, metadata) {
      console.error("🔴 NextAuth Error:", code, metadata);
    },
    warn(code) {
      console.warn("⚠️ NextAuth Warning:", code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === "development") {
        console.log("🪶 NextAuth Debug:", code, metadata);
      }
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
