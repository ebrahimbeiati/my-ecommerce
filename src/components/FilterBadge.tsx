'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { toggleFilterValue } from '@/lib/utils/query';

interface FilterBadgeProps {
  filterKey: string;
  value: string;
  label: string;
}

export default function FilterBadge({ filterKey, value, label }: FilterBadgeProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleRemove = () => {
    const currentSearch = searchParams.toString();
    const newSearch = toggleFilterValue(currentSearch, filterKey, value);
    router.push(`${pathname}?${newSearch}`, { scroll: false });
  };

  return (
    <span className="inline-flex items-center space-x-2 px-3 py-1.5 bg-dark-900 text-light-100 rounded-full text-caption">
      <span>{label}</span>
      <button
        onClick={handleRemove}
        className="hover:bg-light-100/20 rounded-full p-0.5 transition-colors"
        aria-label={`Remove ${label} filter`}
      >
        <svg
          className="w-3.5 h-3.5"
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
    </span>
  );
}
