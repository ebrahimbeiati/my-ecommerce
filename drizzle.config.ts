import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
dotenv.config({path: ".env.local"});
export default defineConfig({
	schema: ["./src/lib/db/schema/*.ts"],
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
    // Use a Neon connection string via env
    url: process.env.DATABASE_URL ?? "",
  },
});

