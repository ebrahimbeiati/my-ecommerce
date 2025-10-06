'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { updateSort } from '@/lib/utils/query';

export const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

interface SortProps {
  className?: string;
}

export default function Sort({ className = '' }: SortProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get current sort value from URL, default to 'featured'
  const currentSort = searchParams.get('sort') || 'featured';
  const currentSortLabel =
    SORT_OPTIONS.find((opt) => opt.value === currentSort)?.label || 'Featured';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSortChange = (sortValue: string) => {
    const currentSearch = searchParams.toString();
    const newSearch = updateSort(currentSearch, sortValue);
    router.push(`${pathname}?${newSearch}`, { scroll: false });
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full md:w-auto min-w-[200px] px-4 py-2.5 bg-light-100 border border-light-400 rounded-lg text-body text-dark-900 hover:border-dark-500 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center space-x-2">
          <span className="text-dark-700 text-caption">Sort by:</span>
          <span className="font-medium">{currentSortLabel}</span>
        </span>
        <svg
          className={`w-5 h-5 text-dark-700 transition-transform ml-2 ${
            isOpen ? 'rotate-180' : ''
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

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-full md:w-56 bg-light-100 border border-light-400 rounded-lg shadow-lg z-50 overflow-hidden">
          <ul className="py-1" role="listbox">
            {SORT_OPTIONS.map((option) => (
              <li key={option.value}>
                <button
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full text-left px-4 py-2.5 text-body transition-colors ${
                    currentSort === option.value
                      ? 'bg-dark-900 text-light-100 font-medium'
                      : 'text-dark-900 hover:bg-light-200'
                  }`}
                  role="option"
                  aria-selected={currentSort === option.value}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {currentSort === option.value && (
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
