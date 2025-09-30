import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

// DATABASE_URL should be your actual Neon connection string
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️  DATABASE_URL not set. Please add your Neon connection string to .env.local");
}

// Use the actual URL or a dummy one that will fail gracefully
const url = databaseUrl || "postgres://dummy:dummy@dummy:5432/dummy?sslmode=require";
const sql = neon(url);
export const db = drizzle({ client: sql });


