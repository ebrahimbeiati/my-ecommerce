import React from 'react';
import { ProductCard } from '@/components/card';
import { getRecommendedProducts } from '@/lib/actions/product';

interface RecommendedProductsProps {
  productId: string;
}

export default async function RecommendedProducts({ productId }: RecommendedProductsProps) {
  const recommendedProducts = await getRecommendedProducts(productId);

  // Don't render anything if no recommendations
  if (recommendedProducts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16">
      <h2 className="text-heading-3 text-dark-900 mb-6">
        You Might Also Like
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.title}
            category="Shoes"
            price={product.price || 0}
            image={product.imageUrl}
            href={`/products/${product.id}`}
          />
        ))}
      </div>
    </section>
  );
}
