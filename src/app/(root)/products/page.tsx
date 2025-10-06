import React from 'react';
import { redirect } from 'next/navigation';
import { ProductCard } from '@/components/card';
import Filters from '@/components/Filters';
import Sort from '@/components/Sort';
import FilterBadge from '@/components/FilterBadge';
import { parseQueryParams, getActiveFilters, stringifyQueryParams } from '@/lib/utils/query';

// Mock product data - in real app, this would come from database
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Nike Air Force 1 Mid \'07',
    category: 'Lifestyle',
    price: 98.97,
    salePrice: 79.97,
    image: '/shoes/shoe-1.jpg',
    gender: 'men',
    colors: ['black', 'white'],
    sizes: ['8', '9', '10', '11', '12'],
    badge: { text: 'Best Seller', type: 'best-seller' as const },
    createdAt: new Date('2025-01-15'),
  },
  {
    id: '2',
    name: 'Nike Air Max 270',
    category: 'Lifestyle',
    price: 150.00,
    image: '/shoes/shoe-2.webp',
    gender: 'men',
    colors: ['blue', 'black'],
    sizes: ['7', '8', '9', '10', '11'],
    createdAt: new Date('2025-02-10'),
  },
  {
    id: '3',
    name: 'Nike React Element 55',
    category: 'Running Shoes',
    price: 120.00,
    image: '/shoes/shoe-3.webp',
    gender: 'women',
    colors: ['white', 'gray'],
    sizes: ['7', '8', '9', '10'],
    createdAt: new Date('2025-03-05'),
  },
  {
    id: '4',
    name: 'Nike Air Jordan 1 High',
    category: 'Lifestyle',
    price: 180.00,
    salePrice: 155.00,
    image: '/shoes/shoe-4.webp',
    gender: 'men',
    colors: ['red', 'black'],
    sizes: ['8', '9', '10', '11', '12'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-03-20'),
  },
  {
    id: '5',
    name: 'Nike Air Max 90',
    category: 'Lifestyle',
    price: 130.00,
    image: '/shoes/shoe-5.avif',
    gender: 'unisex',
    colors: ['gray', 'white'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    createdAt: new Date('2025-01-28'),
  },
  {
    id: '6',
    name: 'Nike Dunk Low Retro',
    category: 'Lifestyle',
    price: 110.00,
    salePrice: 88.00,
    image: '/shoes/shoe-6.avif',
    gender: 'men',
    colors: ['green', 'white'],
    sizes: ['8', '9', '10', '11'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-02-14'),
  },
  {
    id: '7',
    name: 'Nike Blazer Mid \'77',
    category: 'Lifestyle',
    price: 100.00,
    image: '/shoes/shoe-7.avif',
    gender: 'women',
    colors: ['white', 'blue'],
    sizes: ['7', '8', '9', '10', '11'],
    createdAt: new Date('2025-03-12'),
  },
  {
    id: '8',
    name: 'Nike Air VaporMax Plus',
    category: 'Running Shoes',
    price: 210.00,
    image: '/shoes/shoe-8.avif',
    gender: 'men',
    colors: ['blue', 'black'],
    sizes: ['9', '10', '11', '12'],
    createdAt: new Date('2025-04-01'),
  },
  {
    id: '9',
    name: 'Nike Air Zoom Pegasus',
    category: 'Running Shoes',
    price: 130.00,
    image: '/shoes/shoe-9.avif',
    gender: 'unisex',
    colors: ['black', 'red'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: { text: 'Best Seller', type: 'best-seller' as const },
    createdAt: new Date('2025-03-25'),
  },
  {
    id: '10',
    name: 'Nike React Infinity Run',
    category: 'Running Shoes',
    price: 160.00,
    image: '/shoes/shoe-10.avif',
    gender: 'women',
    colors: ['white', 'gray'],
    sizes: ['7', '8', '9', '10'],
    createdAt: new Date('2025-02-22'),
  },
  {
    id: '11',
    name: 'Nike Air Max 97',
    category: 'Lifestyle',
    price: 175.00,
    image: '/shoes/shoe-11.avif',
    gender: 'men',
    colors: ['gray', 'black'],
    sizes: ['8', '9', '10', '11', '12'],
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '12',
    name: 'Nike Free RN 5.0',
    category: 'Running Shoes',
    price: 100.00,
    salePrice: 80.00,
    image: '/shoes/shoe-12.avif',
    gender: 'unisex',
    colors: ['black', 'white'],
    sizes: ['7', '8', '9', '10', '11'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-04-05'),
  },
  {
    id: '13',
    name: 'Nike Air Huarache',
    category: 'Lifestyle',
    price: 120.00,
    image: '/shoes/shoe-13.avif',
    gender: 'women',
    colors: ['white', 'blue'],
    sizes: ['7', '8', '9', '10'],
    createdAt: new Date('2025-03-08'),
  },
  {
    id: '14',
    name: 'Nike Court Vision Low',
    category: 'Lifestyle',
    price: 75.00,
    image: '/shoes/shoe-14.avif',
    gender: 'unisex',
    colors: ['white', 'black'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    createdAt: new Date('2025-02-05'),
  },
  {
    id: '15',
    name: 'Nike Joyride Run Flyknit',
    category: 'Running Shoes',
    price: 180.00,
    image: '/shoes/shoe-15.avif',
    gender: 'men',
    colors: ['black', 'gray'],
    sizes: ['8', '9', '10', '11', '12'],
    createdAt: new Date('2025-04-10'),
  },
  // Additional products for richer catalog
  {
    id: '16',
    name: 'Nike Cortez Classic',
    category: 'Lifestyle',
    price: 85.00,
    image: '/shoes/shoe-1.jpg',
    gender: 'women',
    colors: ['white', 'red'],
    sizes: ['7', '8', '9', '10'],
    createdAt: new Date('2025-01-20'),
  },
  {
    id: '17',
    name: 'Nike ZoomX Vaporfly',
    category: 'Running Shoes',
    price: 250.00,
    salePrice: 225.00,
    image: '/shoes/shoe-2.webp',
    gender: 'men',
    colors: ['green', 'white'],
    sizes: ['8', '9', '10', '11', '12'],
    badge: { text: 'Best Seller', type: 'best-seller' as const },
    createdAt: new Date('2025-04-12'),
  },
  {
    id: '18',
    name: 'Nike Air Max Plus',
    category: 'Lifestyle',
    price: 165.00,
    image: '/shoes/shoe-3.webp',
    gender: 'unisex',
    colors: ['blue', 'gray'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    createdAt: new Date('2025-02-28'),
  },
  {
    id: '19',
    name: 'Nike Pegasus Trail 4',
    category: 'Running Shoes',
    price: 140.00,
    salePrice: 119.00,
    image: '/shoes/shoe-4.webp',
    gender: 'women',
    colors: ['gray', 'red'],
    sizes: ['7', '8', '9', '10', '11'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-03-30'),
  },
  {
    id: '20',
    name: 'Nike Metcon 8',
    category: 'Lifestyle',
    price: 150.00,
    image: '/shoes/shoe-5.avif',
    gender: 'men',
    colors: ['black', 'red'],
    sizes: ['8', '9', '10', '11', '12'],
    createdAt: new Date('2025-03-15'),
  },
  {
    id: '21',
    name: 'Nike Revolution 6',
    category: 'Running Shoes',
    price: 65.00,
    image: '/shoes/shoe-6.avif',
    gender: 'unisex',
    colors: ['black', 'white'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    createdAt: new Date('2025-01-05'),
  },
  {
    id: '22',
    name: 'Nike Air Max 2021',
    category: 'Lifestyle',
    price: 160.00,
    salePrice: 135.00,
    image: '/shoes/shoe-7.avif',
    gender: 'women',
    colors: ['white', 'gray'],
    sizes: ['7', '8', '9', '10'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-02-18'),
  },
  {
    id: '23',
    name: 'Nike Air Zoom Structure',
    category: 'Running Shoes',
    price: 135.00,
    image: '/shoes/shoe-8.avif',
    gender: 'men',
    colors: ['blue', 'white'],
    sizes: ['8', '9', '10', '11', '12'],
    badge: { text: 'Best Seller', type: 'best-seller' as const },
    createdAt: new Date('2025-03-22'),
  },
  {
    id: '24',
    name: 'Nike Flyknit Racer',
    category: 'Running Shoes',
    price: 145.00,
    image: '/shoes/shoe-9.avif',
    gender: 'unisex',
    colors: ['gray', 'blue'],
    sizes: ['7', '8', '9', '10', '11'],
    createdAt: new Date('2025-02-08'),
  },
  {
    id: '25',
    name: 'Nike Air Presto',
    category: 'Lifestyle',
    price: 130.00,
    image: '/shoes/shoe-10.avif',
    gender: 'men',
    colors: ['black', 'white'],
    sizes: ['8', '9', '10', '11', '12'],
    createdAt: new Date('2025-01-25'),
  },
  {
    id: '26',
    name: 'Nike Epic React Flyknit',
    category: 'Running Shoes',
    price: 150.00,
    salePrice: 120.00,
    image: '/shoes/shoe-11.avif',
    gender: 'women',
    colors: ['white', 'blue'],
    sizes: ['7', '8', '9', '10'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-04-08'),
  },
  {
    id: '27',
    name: 'Nike Air Max 1',
    category: 'Lifestyle',
    price: 140.00,
    image: '/shoes/shoe-12.avif',
    gender: 'unisex',
    colors: ['red', 'white'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: { text: 'Best Seller', type: 'best-seller' as const },
    createdAt: new Date('2025-03-18'),
  },
  {
    id: '28',
    name: 'Nike Wildhorse 7',
    category: 'Running Shoes',
    price: 135.00,
    image: '/shoes/shoe-13.avif',
    gender: 'men',
    colors: ['green', 'black'],
    sizes: ['8', '9', '10', '11', '12'],
    createdAt: new Date('2025-02-25'),
  },
  {
    id: '29',
    name: 'Nike Air Tailwind 79',
    category: 'Lifestyle',
    price: 100.00,
    image: '/shoes/shoe-14.avif',
    gender: 'women',
    colors: ['blue', 'white'],
    sizes: ['7', '8', '9', '10'],
    createdAt: new Date('2025-01-30'),
  },
  {
    id: '30',
    name: 'Nike Downshifter 12',
    category: 'Running Shoes',
    price: 70.00,
    image: '/shoes/shoe-15.avif',
    gender: 'unisex',
    colors: ['black', 'gray'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    createdAt: new Date('2025-01-12'),
  },
  {
    id: '31',
    name: 'Nike SB Dunk High',
    category: 'Lifestyle',
    price: 125.00,
    salePrice: 99.00,
    image: '/shoes/shoe-1.jpg',
    gender: 'men',
    colors: ['black', 'red'],
    sizes: ['8', '9', '10', '11', '12'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-04-14'),
  },
  {
    id: '32',
    name: 'Nike Invincible 3',
    category: 'Running Shoes',
    price: 180.00,
    image: '/shoes/shoe-2.webp',
    gender: 'women',
    colors: ['white', 'gray'],
    sizes: ['7', '8', '9', '10'],
    createdAt: new Date('2025-04-15'),
  },
  {
    id: '33',
    name: 'Nike Air Force 1 Low',
    category: 'Lifestyle',
    price: 110.00,
    image: '/shoes/shoe-3.webp',
    gender: 'unisex',
    colors: ['white', 'black'],
    sizes: ['7', '8', '9', '10', '11', '12'],
    badge: { text: 'Best Seller', type: 'best-seller' as const },
    createdAt: new Date('2025-03-28'),
  },
  {
    id: '34',
    name: 'Nike Vaporfly Next% 2',
    category: 'Running Shoes',
    price: 260.00,
    image: '/shoes/shoe-4.webp',
    gender: 'men',
    colors: ['green', 'blue'],
    sizes: ['8', '9', '10', '11', '12'],
    createdAt: new Date('2025-04-18'),
  },
  {
    id: '35',
    name: 'Nike Air Max 95',
    category: 'Lifestyle',
    price: 175.00,
    salePrice: 150.00,
    image: '/shoes/shoe-5.avif',
    gender: 'men',
    colors: ['gray', 'blue'],
    sizes: ['8', '9', '10', '11', '12'],
    badge: { text: 'Extra 20% off', type: 'discount' as const },
    createdAt: new Date('2025-04-20'),
  },
  {
    id: '36',
    name: 'Nike SuperRep Go 3',
    category: 'Running Shoes',
    price: 100.00,
    image: '/shoes/shoe-6.avif',
    gender: 'women',
    colors: ['red', 'black'],
    sizes: ['7', '8', '9', '10'],
    createdAt: new Date('2025-03-10'),
  },
];

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Next.js 15 way: await searchParams
  const params = await searchParams;
  
  // Deduplicate and clean params
  const deduplicatedParams: { [key: string]: string | string[] } = {};
  let hasChanges = false;
  
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined) continue;
    
    if (Array.isArray(value)) {
      // Flatten and deduplicate array values
      const allValues = value.flatMap(v => 
        typeof v === 'string' && v.includes(',') ? v.split(',') : v
      ).map(v => v.trim()).filter(Boolean);
      
      const uniqueValues = Array.from(new Set(allValues));
      
      if (uniqueValues.length > 0) {
        deduplicatedParams[key] = uniqueValues;
      }
      
      // Check if deduplication changed anything
      if (uniqueValues.length !== value.length || JSON.stringify(uniqueValues) !== JSON.stringify(value)) {
        hasChanges = true;
      }
    } else if (typeof value === 'string') {
      // Handle strings that contain commas (mixed encoding issue)
      if (value.includes(',')) {
        const splitValues = value.split(',').map(v => v.trim()).filter(Boolean);
        const uniqueValues = Array.from(new Set(splitValues));
        
        if (uniqueValues.length > 1) {
          deduplicatedParams[key] = uniqueValues;
          hasChanges = true;
        } else if (uniqueValues.length === 1) {
          deduplicatedParams[key] = uniqueValues[0];
          if (value !== uniqueValues[0]) hasChanges = true;
        }
      } else if (value) {
        deduplicatedParams[key] = value;
      }
    }
  }
  
  // If we found duplicates or malformed data, redirect to clean URL
  if (hasChanges) {
    const cleanFilters = parseQueryParams(
      new URLSearchParams(
        Object.entries(deduplicatedParams).flatMap(([key, value]) =>
          Array.isArray(value) ? value.map((v) => [key, v]) : [[key, String(value)]]
        )
      ).toString()
    );
    
    const cleanSearchString = stringifyQueryParams(cleanFilters);
    redirect(`/products${cleanSearchString ? `?${cleanSearchString}` : ''}`);
  }
  
  // Convert to search string format for parsing
  const searchString = new URLSearchParams(
    Object.entries(deduplicatedParams).flatMap(([key, value]) =>
      Array.isArray(value) ? value.map((v) => [key, v]) : [[key, String(value)]]
    )
  ).toString();

  // Parse and get deduplicated filters
  const filters = parseQueryParams(searchString);

  // Get all active filters ONCE and deduplicate explicitly
  const genderFilters = Array.from(new Set(getActiveFilters(searchString, 'gender')));
  const sizeFilters = Array.from(new Set(getActiveFilters(searchString, 'size')));
  const colorFilters = Array.from(new Set(getActiveFilters(searchString, 'color')));
  const priceRangeFilters = Array.from(new Set(getActiveFilters(searchString, 'priceRange')));

  // Filter products based on query parameters
  let filteredProducts = [...MOCK_PRODUCTS];

  // Apply gender filter
  if (genderFilters.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      genderFilters.includes(product.gender)
    );
  }

  // Apply size filter
  if (sizeFilters.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.sizes.some((size) => sizeFilters.includes(size))
    );
  }

  // Apply color filter
  if (colorFilters.length > 0) {
    filteredProducts = filteredProducts.filter((product) =>
      product.colors.some((color) => colorFilters.includes(color))
    );
  }

  // Apply price range filter
  if (priceRangeFilters.length > 0) {
    filteredProducts = filteredProducts.filter((product) => {
      const price = product.salePrice || product.price;
      return priceRangeFilters.some((range) => {
        if (range === '0-100') return price < 100;
        if (range === '100-150') return price >= 100 && price <= 150;
        if (range === '150-200') return price >= 150 && price <= 200;
        if (range === '200+') return price > 200;
        return false;
      });
    });
  }

  // Apply sorting
  const sortValue = filters.sort || 'featured';
  switch (sortValue) {
    case 'newest':
      filteredProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      break;
    case 'price_asc':
      filteredProducts.sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        return priceA - priceB;
      });
      break;
    case 'price_desc':
      filteredProducts.sort((a, b) => {
        const priceA = a.salePrice || a.price;
        const priceB = b.salePrice || b.price;
        return priceB - priceA;
      });
      break;
    case 'featured':
    default:
      // Keep default order for featured
      break;
  }

  // Build active filter badges data (with deduplication)
  const activeFilterBadges: { key: string; value: string; label: string }[] = [];
  
  // Use Set to track already added values and prevent duplicates
  const addedFilters = new Set<string>();
  
  genderFilters.forEach((value) => {
    const filterKey = `gender:${value}`;
    if (!addedFilters.has(filterKey)) {
      const label = value.charAt(0).toUpperCase() + value.slice(1);
      activeFilterBadges.push({ key: 'gender', value, label });
      addedFilters.add(filterKey);
    }
  });

  sizeFilters.forEach((value) => {
    const filterKey = `size:${value}`;
    if (!addedFilters.has(filterKey)) {
      activeFilterBadges.push({ key: 'size', value, label: `Size ${value}` });
      addedFilters.add(filterKey);
    }
  });

  colorFilters.forEach((value) => {
    const filterKey = `color:${value}`;
    if (!addedFilters.has(filterKey)) {
      const label = value.charAt(0).toUpperCase() + value.slice(1);
      activeFilterBadges.push({ key: 'color', value, label });
      addedFilters.add(filterKey);
    }
  });

  priceRangeFilters.forEach((value) => {
    const filterKey = `priceRange:${value}`;
    if (!addedFilters.has(filterKey)) {
      let label = '';
      if (value === '0-100') label = 'Under $100';
      else if (value === '100-150') label = '$100-$150';
      else if (value === '150-200') label = '$150-$200';
      else if (value === '200+') label = 'Over $200';
      activeFilterBadges.push({ key: 'priceRange', value, label });
      addedFilters.add(filterKey);
    }
  });

  return (
    <div className="bg-light-200 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-heading-2 text-dark-900 mb-2">All Products</h1>
          <p className="text-body text-dark-700">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'Product' : 'Products'}
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
            {filteredProducts.length === 0 ? (
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
                {filteredProducts.map((product) => {
                  const displayPrice = product.salePrice || product.price;
                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      category={product.category}
                      price={displayPrice}
                      image={product.image}
                      colors={product.colors.length}
                      badge={product.badge}
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
