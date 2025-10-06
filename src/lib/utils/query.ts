import queryString from 'query-string';

/**
 * Query parameter types for product filtering and sorting
 */
export interface ProductQueryParams {
  gender?: string | string[];
  size?: string | string[];
  color?: string | string[];
  priceRange?: string | string[];
  minPrice?: string;
  maxPrice?: string;
  sort?: string;
  page?: string;
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