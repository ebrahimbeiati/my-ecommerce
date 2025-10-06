import queryString from 'query-string';

/**
 * Query parameter types for product filtering and sorting
 */
export interface ProductQueryParams {
  search?: string;
  gender?: string | string[];
  brand?: string | string[];
  category?: string | string[];
  size?: string | string[];
  color?: string | string[];
  priceRange?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
  limit?: string;
}

/**
 * Normalized product filters for database queries
 */
export interface NormalizedProductFilters {
  search?: string;
  genderSlugs: string[];
  brandSlugs: string[];
  categorySlugs: string[];
  sizeSlugs: string[];
  colorSlugs: string[];
  priceMin?: number;
  priceMax?: number;
  priceRanges: [number | undefined, number | undefined][];
  sort: 'price_asc' | 'price_desc' | 'latest';
  page: number;
  limit: number;
}

/**
 * Parse URL search params into a structured object
 * @param search - URL search string (e.g., "?gender=men&size=10")
 * @returns Parsed query parameters object
 */
export function parseQueryParams(search: string): ProductQueryParams {
  const parsed = queryString.parse(search, {
    arrayFormat: 'comma',
    decode: true, // Ensure URL-encoded characters are decoded
  }) as ProductQueryParams;

  // Deduplicate all array values to prevent duplicate filters
  const deduplicatedParams: ProductQueryParams = {};
  
  for (const [key, value] of Object.entries(parsed)) {
    if (Array.isArray(value)) {
      // Flatten nested arrays and filter out empty strings
      const flatValues = value.flat().filter((v) => v && v.trim());
      // Deduplicate and store
      deduplicatedParams[key as keyof ProductQueryParams] = Array.from(new Set(flatValues)) as any;
    } else if (typeof value === 'string' && value.includes(',')) {
      // Handle case where string contains commas (mixed encoding)
      const splitValues = value.split(',').map((v) => v.trim()).filter(Boolean);
      deduplicatedParams[key as keyof ProductQueryParams] = Array.from(new Set(splitValues)) as any;
    } else if (value) {
      deduplicatedParams[key as keyof ProductQueryParams] = value as any;
    }
  }

  return deduplicatedParams;
}

/**
 * Stringify query parameters into URL search string
 * @param params - Query parameters object
 * @returns URL search string
 */
export function stringifyQueryParams(params: ProductQueryParams): string {
  // Filter out empty values and deduplicate arrays
  const cleanParams = Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Deduplicate arrays before stringifying
        if (Array.isArray(value)) {
          const uniqueValues = Array.from(new Set(value.filter((v) => v && v.trim())));
          if (uniqueValues.length > 0) {
            acc[key] = uniqueValues;
          }
        } else {
          acc[key] = value;
        }
      }
      return acc;
    },
    {} as Record<string, any>
  );

  return queryString.stringify(cleanParams, {
    arrayFormat: 'comma',
    skipNull: true,
    skipEmptyString: true,
    encode: true, // Always encode special characters properly
  });
}

/**
 * Add or update a query parameter
 * @param currentSearch - Current URL search string
 * @param key - Parameter key to update
 * @param value - New value (string or array of strings)
 * @returns New search string
 */
export function addQueryParam(
  currentSearch: string,
  key: string,
  value: string | string[]
): string {
  const params = parseQueryParams(currentSearch);
  
  // Handle array values (multi-select filters)
  if (Array.isArray(value)) {
    params[key as keyof ProductQueryParams] = value as any;
  } else {
    params[key as keyof ProductQueryParams] = value as any;
  }

  return stringifyQueryParams(params);
}

/**
 * Remove a query parameter
 * @param currentSearch - Current URL search string
 * @param key - Parameter key to remove
 * @returns New search string
 */
export function removeQueryParam(currentSearch: string, key: string): string {
  const params = parseQueryParams(currentSearch);
  delete params[key as keyof ProductQueryParams];
  return stringifyQueryParams(params);
}

/**
 * Toggle a value in a multi-select filter
 * @param currentSearch - Current URL search string
 * @param key - Parameter key (e.g., "size", "color")
 * @param value - Value to toggle
 * @returns New search string
 */
export function toggleFilterValue(
  currentSearch: string,
  key: string,
  value: string
): string {
  const params = parseQueryParams(currentSearch);
  const currentValue = params[key as keyof ProductQueryParams];

  let newValues: string[];

  if (Array.isArray(currentValue)) {
    // Deduplicate first to handle any existing duplicates
    const uniqueValues = Array.from(new Set(currentValue));
    
    // If value exists, remove it; otherwise, add it
    if (uniqueValues.includes(value)) {
      newValues = uniqueValues.filter((v) => v !== value);
    } else {
      newValues = [...uniqueValues, value];
    }
  } else if (typeof currentValue === 'string') {
    // Convert single value to array and toggle
    if (currentValue === value) {
      newValues = [];
    } else {
      newValues = [currentValue, value];
    }
  } else {
    // No existing value, create array with new value
    newValues = [value];
  }

  // Ensure no duplicates in final result
  newValues = Array.from(new Set(newValues));

  // If array is empty, remove the parameter entirely
  if (newValues.length === 0) {
    return removeQueryParam(currentSearch, key);
  }

  return addQueryParam(currentSearch, key, newValues);
}

/**
 * Update sort parameter and reset page to 1
 * @param currentSearch - Current URL search string
 * @param sortValue - Sort option value
 * @returns New search string
 */
export function updateSort(currentSearch: string, sortValue: string): string {
  const params = parseQueryParams(currentSearch);
  params.sort = sortValue;
  params.page = '1'; // Reset to first page on sort change
  return stringifyQueryParams(params);
}

/**
 * Clear all filters, keeping only sort if present
 * @param currentSearch - Current URL search string
 * @returns New search string with filters cleared
 */
export function clearAllFilters(currentSearch: string): string {
  const params = parseQueryParams(currentSearch);
  const sort = params.sort;
  
  return stringifyQueryParams(sort ? { sort } : {});
}

/**
 * Check if a filter value is currently active
 * @param currentSearch - Current URL search string
 * @param key - Parameter key
 * @param value - Value to check
 * @returns True if the value is active in the current filters
 */
export function isFilterActive(
  currentSearch: string,
  key: string,
  value: string
): boolean {
  const params = parseQueryParams(currentSearch);
  const currentValue = params[key as keyof ProductQueryParams];

  if (Array.isArray(currentValue)) {
    // Deduplicate before checking
    const uniqueValues = Array.from(new Set(currentValue));
    return uniqueValues.includes(value);
  }
  
  return currentValue === value;
}

/**
 * Get all active filter values for a given key
 * @param currentSearch - Current URL search string
 * @param key - Parameter key
 * @returns Array of active values (deduplicated)
 */
export function getActiveFilters(
  currentSearch: string,
  key: string
): string[] {
  const params = parseQueryParams(currentSearch);
  const value = params[key as keyof ProductQueryParams];

  if (Array.isArray(value)) {
    // Deduplicate array values
    return Array.from(new Set(value));
  }
  
  if (typeof value === 'string') {
    return [value];
  }
  
  return [];
}

/**
 * Count total number of active filters (excluding sort and page)
 * @param currentSearch - Current URL search string
 * @returns Number of active filters
 */
export function countActiveFilters(currentSearch: string): number {
  const params = parseQueryParams(currentSearch);
  let count = 0;

  // Count all filter parameters except sort and page
  const filterKeys: (keyof ProductQueryParams)[] = [
    'gender',
    'size',
    'color',
    'priceRange',
    'minPrice',
    'maxPrice',
  ];

  filterKeys.forEach((key) => {
    const value = params[key];
    if (value) {
      if (Array.isArray(value)) {
        count += value.length;
      } else {
        count += 1;
      }
    }
  });

  return count;
}

/**
 * Parse price range string into min/max tuple
 * @param range - Price range string (e.g., "0-100", "100-150", "200+")
 * @returns Tuple of [min, max] where max can be undefined for open-ended ranges
 */
function parsePriceRange(range: string): [number | undefined, number | undefined] {
  if (range === '0-100') return [0, 100];
  if (range === '100-150') return [100, 150];
  if (range === '150-200') return [150, 200];
  if (range === '200+') return [200, undefined];
  
  // Handle custom ranges like "50-100"
  const match = range.match(/^(\d+)-(\d+)$/);
  if (match) {
    return [Number(match[1]), Number(match[2])];
  }
  
  // Handle open-ended ranges like "100+"
  const openMatch = range.match(/^(\d+)\+$/);
  if (openMatch) {
    return [Number(openMatch[1]), undefined];
  }
  
  return [undefined, undefined];
}

/**
 * Convert array or single value to string array
 */
function toStringArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/**
 * Parse URL search params into normalized filters for database queries
 * @param searchParams - URL search params object or search string
 * @returns Normalized filters object ready for database queries
 */
export function parseFilterParams(
  searchParams: Record<string, string | string[] | undefined> | string
): NormalizedProductFilters {
  // If searchParams is a string, parse it first
  const params = typeof searchParams === 'string' 
    ? parseQueryParams(searchParams) 
    : searchParams as ProductQueryParams;

  // Parse arrays with deduplication
  const genderSlugs = Array.from(new Set(toStringArray(params.gender)));
  const brandSlugs = Array.from(new Set(toStringArray(params.brand)));
  const categorySlugs = Array.from(new Set(toStringArray(params.category)));
  const sizeSlugs = Array.from(new Set(toStringArray(params.size)));
  const colorSlugs = Array.from(new Set(toStringArray(params.color)));

  // Parse price ranges
  const priceRanges: [number | undefined, number | undefined][] = [];
  const priceRangeValues = toStringArray(params.priceRange);
  for (const range of priceRangeValues) {
    const parsed = parsePriceRange(range);
    if (parsed[0] !== undefined || parsed[1] !== undefined) {
      priceRanges.push(parsed);
    }
  }

  // Parse min/max prices
  const priceMin = params.minPrice ? Number(params.minPrice) : undefined;
  const priceMax = params.maxPrice ? Number(params.maxPrice) : undefined;

  // Parse sort
  let sort: NormalizedProductFilters['sort'] = 'latest';
  if (params.sort === 'price_asc' || params.sort === 'price_desc' || params.sort === 'latest') {
    sort = params.sort;
  } else if (params.sort === 'newest') {
    sort = 'latest';
  }

  // Parse pagination
  const page = params.page ? Math.max(1, Number(params.page)) : 1;
  const limit = params.limit ? Math.max(1, Math.min(60, Number(params.limit))) : 12;

  return {
    search: params.search?.trim() || undefined,
    genderSlugs,
    brandSlugs,
    categorySlugs,
    sizeSlugs,
    colorSlugs,
    priceMin: !isNaN(priceMin!) ? priceMin : undefined,
    priceMax: !isNaN(priceMax!) ? priceMax : undefined,
    priceRanges,
    sort,
    page,
    limit,
  };
}