import "dotenv/config";
import { db } from "../src/db/client";
import { products, type InsertProduct } from "../src/db/schema";

const sampleProducts: InsertProduct[] = [
  {
    slug: "Nike-ultraboost-1",
    title: "Nike Ultraboost 1.0",
    description: "Responsive running shoes with Boost cushioning.",
    brand: "Nike",
    priceCents: 18000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  },
  {
    slug: "Nike-stan-smith",
    title: "Nike Stan Smith",
    description: "Timeless leather sneaker classic.",
    brand: "Nike",
    priceCents: 8500,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552",
  },
  {
    slug: "Nike-samba",
    title: "Nike Samba",
    description: "Heritage indoor soccer turned lifestyle icon.",
    brand: "Nike",
    priceCents: 10000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf1973a509f",
  },
  {
    slug: "Nike-gazelle",
    title: "Nike Gazelle",
    description: "Classic suede sneaker with timeless appeal.",
    brand: "Nike",
    priceCents: 9000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
  },
  {
    slug: "Nike-nmd-r1",
    title: "Nike NMD R1",
    description: "Modern lifestyle sneaker with Boost technology.",
    brand: "Nike",
    priceCents: 12000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
  },
];

async function seed() {
  console.log("🌱 Starting database seed...");
  
  try {
    // Clear existing products
    await db.delete(products);
    console.log("🗑️  Cleared existing products");
    
    // Insert sample products
    for (const product of sampleProducts) {
      await db.insert(products).values(product);
      console.log(`✅ Added: ${product.title}`);
    }
    
    console.log(`🎉 Successfully seeded ${sampleProducts.length} products!`);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

// Run seed if called directly
if (require.main === module) {
  seed();
}

export { seed };