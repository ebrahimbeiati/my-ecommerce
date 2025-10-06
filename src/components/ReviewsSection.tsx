import React from 'react';
import { Star, Package } from 'lucide-react';
import { getProductReviews } from '@/lib/actions/product';
import CollapsibleSection from './CollapsibleSection';

interface ReviewsSectionProps {
  productId: string;
}

export default async function ReviewsSection({ productId }: ReviewsSectionProps) {
  const reviews = await getProductReviews(productId);

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-orange text-orange'
                : 'fill-light-300 text-light-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <CollapsibleSection 
      title={`Reviews (${reviews.length})`} 
      defaultOpen={reviews.length > 0}
    >
      {reviews.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-dark-500 mx-auto mb-3" />
          <p className="text-body-medium text-dark-900 mb-1">No reviews yet</p>
          <p className="text-caption text-dark-700">
            Be the first to review this product
          </p>
          <button className="mt-4 px-6 py-2 bg-dark-900 text-light-100 rounded-lg text-caption font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2">
            Write a Review
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Average Rating Summary */}
          <div className="flex items-center gap-4 pb-4 border-b border-light-300">
            <div>
              <div className="text-heading-3 text-dark-900 font-medium mb-1">
                {averageRating.toFixed(1)}
              </div>
              {renderStars(Math.round(averageRating))}
            </div>
            <div className="text-body text-dark-700">
              Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
            </div>
          </div>

          {/* Individual Reviews */}
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-body-medium text-dark-900 font-medium">
                        {review.author}
                      </span>
                      {renderStars(review.rating)}
                    </div>
                    {review.title && (
                      <h4 className="text-body-medium text-dark-900 font-medium mb-1">
                        {review.title}
                      </h4>
                    )}
                  </div>
                  <time className="text-caption text-dark-700 flex-shrink-0">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <div className="text-body text-dark-700 leading-relaxed">
                  {review.content.length > 300 ? (
                    <details className="group">
                      <summary className="cursor-pointer list-none">
                        <span>{review.content.substring(0, 300)}...</span>
                        <span className="text-dark-900 font-medium ml-2 group-open:hidden">
                          Read more
                        </span>
                        <div className="hidden group-open:block mt-2">
                          {review.content.substring(300)}
                        </div>
                        <span className="text-dark-900 font-medium ml-2 hidden group-open:inline">
                          Show less
                        </span>
                      </summary>
                    </details>
                  ) : (
                    <p>{review.content}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Write Review Button */}
          <div className="pt-4 border-t border-light-300">
            <button className="w-full sm:w-auto px-6 py-3 bg-light-200 text-dark-900 rounded-lg text-body-medium font-medium hover:bg-light-300 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2">
              Write a Review
            </button>
          </div>
        </div>
      )}
    </CollapsibleSection>
  );
}
