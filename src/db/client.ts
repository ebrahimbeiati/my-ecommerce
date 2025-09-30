import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

neonConfig.fetchConnectionCache = true;

// DATABASE_URL should be your actual Neon connection string
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("⚠️  DATABASE_URL not set. Please add your Neon connection string to .env.local");
}

// Use the actual URL or a dummy one that will fail gracefully
let url = databaseUrl || "postgres://dummy:dummy@dummy:5432/dummy?sslmode=require";

// Clean up the connection string if it's in psql format
if (url.startsWith("psql '")) {
  url = url.replace("psql '", "").replace("'", "");
}

const sql = neon(url);
export const db = drizzle({ client: sql });

