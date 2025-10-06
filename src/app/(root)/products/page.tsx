import React from 'react';
import { ProductCard } from '@/components/card';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import FilterBadge from '@/components/FilterBadge';
import { parseFilterParams, getActiveFilters } from '@/lib/utils/query';
import { getAllProducts } from '@/lib/actions/product';

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Next.js 15: await searchParams
  const params = await searchParams;

  // Parse filters from URL params
  const filters = parseFilterParams(params);

  // Fetch products from database
  const { products, totalCount } = await getAllProducts(filters);

  // Convert to search string for filter badges
  const searchString = new URLSearchParams(
    Object.entries(params).flatMap(([key, value]) =>
      value !== undefined
        ? Array.isArray(value)
          ? value.map((v) => [key, v])
          : [[key, String(value)]]
        : []
    )
  ).toString();

  // Get active filters for badges
  const genderFilters = getActiveFilters(searchString, 'gender');
  const brandFilters = getActiveFilters(searchString, 'brand');
  const categoryFilters = getActiveFilters(searchString, 'category');
  const sizeFilters = getActiveFilters(searchString, 'size');
  const colorFilters = getActiveFilters(searchString, 'color');
  const priceRangeFilters = getActiveFilters(searchString, 'priceRange');

  // Build active filter badges
  const activeFilterBadges: { key: string; value: string; label: string }[] = [];

  genderFilters.forEach((value) => {
    const label = value.charAt(0).toUpperCase() + value.slice(1);
    activeFilterBadges.push({ key: 'gender', value, label });
  });

  brandFilters.forEach((value) => {
    const label = value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    activeFilterBadges.push({ key: 'brand', value, label });
  });

  categoryFilters.forEach((value) => {
    const label = value.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    activeFilterBadges.push({ key: 'category', value, label });
  });

  sizeFilters.forEach((value) => {
    activeFilterBadges.push({ key: 'size', value, label: `Size ${value}` });
  });

  colorFilters.forEach((value) => {
    const label = value.charAt(0).toUpperCase() + value.slice(1);
    activeFilterBadges.push({ key: 'color', value, label });
  });

  priceRangeFilters.forEach((value) => {
    let label = '';
    if (value === '0-100') label = 'Under $100';
    else if (value === '100-150') label = '$100-$150';
    else if (value === '150-200') label = '$150-$200';
    else if (value === '200+') label = 'Over $200';
    else label = value;
    activeFilterBadges.push({ key: 'priceRange', value, label });
  });

  return (
    <div className="bg-light-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-heading-2 text-dark-900 mb-2">All Products</h1>
          <p className="text-body text-dark-700">
            {totalCount} {totalCount === 1 ? 'Product' : 'Products'}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <Filters />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort & Active Filters */}
            <div className="mb-6 space-y-4">
              {/* Sort Dropdown */}
              <div className="flex justify-between items-center">
                <div className="flex-1" />
                <Sort />
              </div>

              {/* Active Filter Badges */}
              {activeFilterBadges.length > 0 && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-caption text-dark-700 font-medium">Active Filters:</span>
                  {activeFilterBadges.map((badge, index) => (
                    <FilterBadge
                      key={`${badge.key}-${badge.value}-${index}`}
                      filterKey={badge.key}
                      value={badge.value}
                      label={badge.label}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Products Grid or Empty State */}
            {products.length === 0 ? (
              <div className="bg-light-100 rounded-lg p-12 text-center">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-dark-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="text-heading-3 text-dark-900 mb-2">
                  No products found
                </h3>
                <p className="text-body text-dark-700 mb-6">
                  Try adjusting your filters to see more results
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => {
                  // Products with null prices shouldn't appear due to server filtering
                  // but we add a safeguard here for defensive programming
                  if (product.minPrice === null) return null;

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      category={product.subtitle || 'Shoes'}
                      price={product.minPrice}
                      image={product.imageUrl || '/shoes/shoe-1.jpg'}
                      href={`/products/${product.id}`}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
