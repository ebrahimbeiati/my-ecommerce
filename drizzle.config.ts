import { defineConfig } from "drizzle-kit";

export default defineConfig({
	schema: "./src/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
    // Use a Neon connection string via env
    url: process.env.DATABASE_URL ?? "",
  },
});


