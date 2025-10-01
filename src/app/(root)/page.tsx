import React from 'react';
import { ProductCard, PromotionalCard } from '@/components/card';

const Home = () => {
  // Placeholder product data
  const products = [
    {
      id: '1',
      name: 'Nike Air Force 1 Mid \'07',
      category: 'Men\'s Shoes',
      price: 98.97,
      image: '/shoes/shoe-1.jpg',
      colors: 6,
      badge: { text: 'Best Seller', type: 'best-seller' as const },
      href: '/products/1',
    },
    {
      id: '2',
      name: 'Nike Air Max 270',
      category: 'Men\'s Shoes',
      price: 150.00,
      image: '/shoes/shoe-2.webp',
      colors: 4,
      badge: { text: 'Extra 20% off', type: 'discount' as const },
      href: '/products/2',
    },
    {
      id: '3',
      name: 'Nike React Element 55',
      category: 'Women\'s Shoes',
      price: 120.00,
      image: '/shoes/shoe-3.webp',
      colors: 8,
      href: '/products/3',
    },
    {
      id: '4',
      name: 'Nike Air Jordan 1 High',
      category: 'Men\'s Shoes',
      price: 180.00,
      image: '/shoes/shoe-4.webp',
      colors: 5,
      badge: { text: 'Best Seller', type: 'best-seller' as const },
      href: '/products/4',
    },
    {
      id: '5',
      name: 'Nike Air Max 90',
      category: 'Unisex Shoes',
      price: 130.00,
      image: '/shoes/shoe-5.avif',
      colors: 7,
      href: '/products/5',
    },
    {
      id: '6',
      name: 'Nike Dunk Low Retro',
      category: 'Men\'s Shoes',
      price: 110.00,
      image: '/shoes/shoe-6.avif',
      colors: 3,
      badge: { text: 'Extra 20% off', type: 'discount' as const },
      href: '/products/6',
    },
    {
      id: '7',
      name: 'Nike Blazer Mid \'77',
      category: 'Women\'s Shoes',
      price: 100.00,
      image: '/shoes/shoe-7.avif',
      colors: 4,
      href: '/products/7',
    },
    {
      id: '8',
      name: 'Nike Air VaporMax Plus',
      category: 'Men\'s Shoes',
      price: 210.00,
      image: '/shoes/shoe-8.avif',
      colors: 6,
      href: '/products/8',
    },
    {
      id: '9',
      name: 'Nike Air Zoom Pegasus',
      category: 'Running Shoes',
      price: 130.00,
      image: '/shoes/shoe-9.avif',
      colors: 5,
      badge: { text: 'Best Seller', type: 'best-seller' as const },
      href: '/products/9',
    },
    {
      id: '10',
      name: 'Nike React Infinity Run',
      category: 'Running Shoes',
      price: 160.00,
      image: '/shoes/shoe-10.avif',
      colors: 4,
      href: '/products/10',
    },
    {
      id: '11',
      name: 'Nike Air Max 97',
      category: 'Men\'s Shoes',
      price: 175.00,
      image: '/shoes/shoe-11.avif',
      colors: 6,
      href: '/products/11',
    },
    {
      id: '12',
      name: 'Nike Free RN 5.0',
      category: 'Running Shoes',
      price: 100.00,
      image: '/shoes/shoe-12.avif',
      colors: 3,
      badge: { text: 'Extra 20% off', type: 'discount' as const },
      href: '/products/12',
    },
  ];

  // Placeholder promotional cards
  const promotionalCards = [
    {
      id: 'promo-1',
      title: 'Summer Must-Haves: Air Max Collection',
      image: '/trending-1.png',
      href: '/collections/summer',
    },
    {
      id: 'promo-2',
      title: 'Air Jordan 11 Retro Low LE',
      image: '/trending-2.png',
      href: '/collections/jordan',
    },
    {
      id: 'promo-3',
      title: 'Nike Air Max 90 Essential',
      image: '/trending-3.png',
      href: '/collections/essentials',
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="bg-light-200 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-heading-1 text-dark-900 mb-6">
            Nike Store
          </h1>
          <p className="text-lead text-dark-700 max-w-2xl mx-auto">
            Discover the latest collection of Nike shoes, clothing, and accessories. 
            Find your perfect style and performance gear.
          </p>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading-2 text-dark-900 mb-8 text-center">
            Best of Air Max
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Collections Section */}
      <section className="py-16 lg:py-20 bg-light-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-heading-2 text-dark-900 mb-8 text-center">
            Trending Collections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {promotionalCards.map((card) => (
              <PromotionalCard key={card.id} {...card} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

