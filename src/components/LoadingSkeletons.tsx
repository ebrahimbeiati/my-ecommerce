import React from 'react';

export function ReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {/* Rating Summary Skeleton */}
      <div className="flex items-center gap-4 pb-4 border-b border-light-300">
        <div>
          <div className="h-8 w-12 bg-light-300 rounded mb-2" />
          <div className="h-4 w-24 bg-light-300 rounded" />
        </div>
        <div className="h-4 w-32 bg-light-300 rounded" />
      </div>

      {/* Review Items Skeleton */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-4 w-32 bg-light-300 rounded" />
                <div className="h-4 w-24 bg-light-300 rounded" />
              </div>
            </div>
            <div className="h-4 w-20 bg-light-300 rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full bg-light-300 rounded" />
            <div className="h-4 w-5/6 bg-light-300 rounded" />
            <div className="h-4 w-4/6 bg-light-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function RecommendedProductsSkeleton() {
  return (
    <section className="mt-16">
      <div className="h-8 w-48 bg-light-300 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-light-100 rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-light-300" />
            <div className="p-4 space-y-3">
              <div className="h-4 w-3/4 bg-light-300 rounded" />
              <div className="h-3 w-1/2 bg-light-300 rounded" />
              <div className="h-4 w-1/4 bg-light-300 rounded" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
