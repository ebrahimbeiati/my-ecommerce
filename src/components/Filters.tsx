'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  toggleFilterValue,
  clearAllFilters,
  isFilterActive,
  countActiveFilters,
} from '@/lib/utils/query';

// Filter options configuration
const FILTER_OPTIONS = {
  gender: [
    { label: 'Men', value: 'men' },
    { label: 'Women', value: 'women' },
    { label: 'Unisex', value: 'unisex' },
  ],
  size: [
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' },
    { label: '11', value: '11' },
    { label: '12', value: '12' },
  ],
  color: [
    { label: 'Black', value: 'black', hex: '#000000' },
    { label: 'White', value: 'white', hex: '#FFFFFF' },
    { label: 'Red', value: 'red', hex: '#FF0000' },
    { label: 'Blue', value: 'blue', hex: '#1E3A8A' },
    { label: 'Green', value: 'green', hex: '#10B981' },
    { label: 'Gray', value: 'gray', hex: '#6B7280' },
  ],
  priceRange: [
    { label: 'Under $100', value: '0-100', min: 0, max: 100 },
    { label: '$100 - $150', value: '100-150', min: 100, max: 150 },
    { label: '$150 - $200', value: '150-200', min: 150, max: 200 },
    { label: 'Over $200', value: '200+', min: 200, max: 99999 },
  ],
};

interface FiltersProps {
  className?: string;
  brands?: Array<{ label: string; value: string }>;
  categories?: Array<{ label: string; value: string }>;
}

export default function Filters({ className = '', brands = [], categories = [] }: FiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    gender: true,
    brand: brands.length > 0,
    category: categories.length > 0,
    size: true,
    color: true,
    priceRange: true,
  });

  // Close mobile drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [searchParams]);

  const handleFilterToggle = (key: string, value: string) => {
    const currentSearch = searchParams.toString();
    const newSearch = toggleFilterValue(currentSearch, key, value);
    router.push(`${pathname}?${newSearch}`, { scroll: false });
  };

  const handleClearAll = () => {
    const currentSearch = searchParams.toString();
    const newSearch = clearAllFilters(currentSearch);
    router.push(newSearch ? `${pathname}?${newSearch}` : pathname, {
      scroll: false,
    });
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const currentSearch = searchParams.toString();
  const activeFilterCount = countActiveFilters(currentSearch);

  // Filter content component
  const FilterContent = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-light-300">
        <h2 className="text-heading-3 text-dark-900 font-medium">Filters</h2>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="text-caption text-dark-700 hover:text-dark-900 underline transition-colors"
          >
            Clear All ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Gender Filter */}
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleSection('gender')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-body-medium text-dark-900 font-medium">
            Gender
          </h3>
          <svg
            className={`w-5 h-5 text-dark-700 transition-transform ${
              expandedSections.gender ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.gender && (
          <div className="mt-3 space-y-2">
            {FILTER_OPTIONS.gender.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(currentSearch, 'gender', option.value)}
                  onChange={() => handleFilterToggle('gender', option.value)}
                  className="w-4 h-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Brand Filter */}
      {brands.length > 0 && (
        <div className="border-b border-light-300 pb-4">
          <button
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-left group"
          >
            <h3 className="text-body-medium text-dark-900 font-medium">Brand</h3>
            <svg
              className={`w-5 h-5 text-dark-700 transition-transform ${
                expandedSections.brand ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expandedSections.brand && (
            <div className="mt-3 space-y-2">
              {brands.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isFilterActive(currentSearch, 'brand', option.value)}
                    onChange={() => handleFilterToggle('brand', option.value)}
                    className="w-4 h-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="border-b border-light-300 pb-4">
          <button
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-left group"
          >
            <h3 className="text-body-medium text-dark-900 font-medium">Category</h3>
            <svg
              className={`w-5 h-5 text-dark-700 transition-transform ${
                expandedSections.category ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {expandedSections.category && (
            <div className="mt-3 space-y-2">
              {categories.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center space-x-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={isFilterActive(currentSearch, 'category', option.value)}
                    onChange={() => handleFilterToggle('category', option.value)}
                    className="w-4 h-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0 cursor-pointer"
                  />
                  <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Size Filter */}
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-body-medium text-dark-900 font-medium">Size</h3>
          <svg
            className={`w-5 h-5 text-dark-700 transition-transform ${
              expandedSections.size ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.size && (
          <div className="mt-3 space-y-2">
            {FILTER_OPTIONS.size.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(currentSearch, 'size', option.value)}
                  onChange={() => handleFilterToggle('size', option.value)}
                  className="w-4 h-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-body-medium text-dark-900 font-medium">Color</h3>
          <svg
            className={`w-5 h-5 text-dark-700 transition-transform ${
              expandedSections.color ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.color && (
          <div className="mt-3 space-y-2">
            {FILTER_OPTIONS.color.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(currentSearch, 'color', option.value)}
                  onChange={() => handleFilterToggle('color', option.value)}
                  className="w-4 h-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0 cursor-pointer"
                />
                <div className="flex items-center space-x-2 flex-1">
                  <div
                    className="w-5 h-5 rounded-full border border-light-400"
                    style={{ backgroundColor: option.hex }}
                  />
                  <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                    {option.label}
                  </span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('priceRange')}
          className="flex items-center justify-between w-full text-left group"
        >
          <h3 className="text-body-medium text-dark-900 font-medium">
            Price Range
          </h3>
          <svg
            className={`w-5 h-5 text-dark-700 transition-transform ${
              expandedSections.priceRange ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.priceRange && (
          <div className="mt-3 space-y-2">
            {FILTER_OPTIONS.priceRange.map((option) => (
              <label
                key={option.value}
                className="flex items-center space-x-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(
                    currentSearch,
                    'priceRange',
                    option.value
                  )}
                  onChange={() => handleFilterToggle('priceRange', option.value)}
                  className="w-4 h-4 rounded border-light-400 text-dark-900 focus:ring-2 focus:ring-dark-900 focus:ring-offset-0 cursor-pointer"
                />
                <span className="text-body text-dark-700 group-hover:text-dark-900 transition-colors">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-40 bg-dark-900 text-light-100 px-6 py-3 rounded-full shadow-lg flex items-center space-x-2 hover:bg-dark-700 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        <span className="font-medium">Filters</span>
        {activeFilterCount > 0 && (
          <span className="bg-red text-light-100 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block bg-light-100 rounded-lg p-6 h-fit sticky top-20 ${className}`}
      >
        <FilterContent />
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div
            className="md:hidden fixed inset-0 bg-dark-900/60 z-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer */}
          <div className="md:hidden fixed inset-y-0 left-0 z-50 w-full max-w-sm bg-light-100 shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-6">
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-dark-700 hover:text-dark-900 transition-colors"
                aria-label="Close filters"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <FilterContent />
            </div>
          </div>
        </>
      )}
    </>
  );
}
