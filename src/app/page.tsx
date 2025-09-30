import { db, products } from "@/db";
import Header from "@/components/Header";
import Cart from "@/components/Cart";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

// Mock data for demo purposes
const mockProducts = [
  {
    id: 1,
    slug: "adidas-ultraboost-1",
    title: "Adidas Ultraboost 1.0",
    description: "Responsive running shoes with Boost cushioning.",
    brand: "Adidas",
    priceCents: 18000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 2,
    slug: "adidas-stan-smith",
    title: "Adidas Stan Smith",
    description: "Timeless leather sneaker classic.",
    brand: "Adidas",
    priceCents: 8500,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 3,
    slug: "adidas-samba",
    title: "Adidas Samba",
    description: "Heritage indoor soccer turned lifestyle icon.",
    brand: "Adidas",
    priceCents: 10000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1597045566677-8cf1973a509f",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 4,
    slug: "adidas-gazelle",
    title: "Adidas Gazelle",
    description: "Classic suede sneaker with timeless appeal.",
    brand: "Adidas",
    priceCents: 9000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 5,
    slug: "adidas-nmd-r1",
    title: "Adidas NMD R1",
    description: "Modern lifestyle sneaker with Boost technology.",
    brand: "Adidas",
    priceCents: 12000,
    currency: "USD",
    imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default async function Home() {
  let items = [];
  let usingMockData = false;
  
  try {
    items = await db.select().from(products);
  } catch (err) {
    console.warn("Database not connected, using mock data:", err instanceof Error ? err.message : "Unknown error");
    items = mockProducts;
    usingMockData = true;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <HomeClient products={items} usingMockData={usingMockData} />
      <Cart />
    </div>
  );
}
