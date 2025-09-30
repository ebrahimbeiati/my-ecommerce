import "dotenv/config";
import { db } from "../src/db/client";
import { products } from "../src/db/schema";

async function migrate() {
  console.log("🚀 Starting database migration...");
  
  try {
    // Test database connection
    await db.select().from(products).limit(1);
    console.log("✅ Database connection successful");
    
    // The actual table creation is handled by drizzle-kit push
    console.log("📋 Tables should be created via: npm run db:push");
    console.log("🌱 Run seed with: npm run db:seed");
    
  } catch (error) {
    console.error("❌ Migration error:", error);
    console.log("💡 Make sure your DATABASE_URL is set in .env.local");
    process.exit(1);
  }
}

// Run migrate if called directly
if (require.main === module) {
  migrate();
}

export { migrate };
