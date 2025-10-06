'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
}

interface ProductVariant {
  id: string;
  colorName: string;
  colorValue: string;
  images: ProductImage[];
}

interface ProductGalleryProps {
  variants: ProductVariant[];
  productName: string;
}

export default function ProductGallery({ variants, productName }: ProductGalleryProps) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Find the first variant with valid images
  const getFirstValidVariant = () => {
    return variants.find(variant => 
      variant.images.length > 0 && 
      !imageErrors.has(variant.images[0].url)
    );
  };

  // Initialize with the first valid variant
  useEffect(() => {
    const firstValidVariant = getFirstValidVariant();
    if (firstValidVariant && !selectedVariantId) {
      setSelectedVariantId(firstValidVariant.id);
    }
  }, [variants, imageErrors]);

  const currentVariant = variants.find(v => v.id === selectedVariantId) || getFirstValidVariant();
  
  // Filter out broken images
  const validImages = currentVariant?.images.filter(img => !imageErrors.has(img.url)) || [];

  const handleImageError = (imageUrl: string) => {
    setImageErrors(prev => new Set(prev).add(imageUrl));
    // If current image failed, move to next valid image
    if (validImages[selectedImageIndex]?.url === imageUrl) {
      const nextValidIndex = validImages.findIndex((img, idx) => 
        idx !== selectedImageIndex && !imageErrors.has(img.url)
      );
      if (nextValidIndex !== -1) {
        setSelectedImageIndex(nextValidIndex);
      } else {
        setSelectedImageIndex(0);
      }
    }
  };

  const handleVariantChange = (variantId: string) => {
    setSelectedVariantId(variantId);
    setSelectedImageIndex(0);
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handlePrevious = () => {
    setSelectedImageIndex(prev => 
      prev === 0 ? validImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setSelectedImageIndex(prev => 
      prev === validImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, index?: number) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'Enter' && index !== undefined) {
      e.preventDefault();
      handleThumbnailClick(index);
    }
  };

  // Empty state when no valid images
  if (validImages.length === 0) {
    return (
      <div className="w-full">
        <div className="aspect-square bg-light-200 rounded-lg flex flex-col items-center justify-center mb-4">
          <ImageOff className="w-16 h-16 text-dark-500 mb-2" />
          <p className="text-body text-dark-700">No images available</p>
        </div>
        {variants.length > 1 && (
          <div className="space-y-3">
            <p className="text-caption text-dark-700 font-medium">Available Colors</p>
            <div className="flex flex-wrap gap-2">
              {variants.map(variant => (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant.id)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${
                    variant.id === selectedVariantId
                      ? 'border-dark-900 scale-110'
                      : 'border-light-300 hover:border-dark-500'
                  }`}
                  style={{ backgroundColor: variant.colorValue }}
                  aria-label={`Select ${variant.colorName} color`}
                  title={variant.colorName}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  const currentImage = validImages[selectedImageIndex];

  return (
    <div className="w-full space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-light-200 rounded-lg overflow-hidden group">
        <Image
          src={currentImage.url}
          alt={currentImage.alt || `${productName} - ${currentVariant?.colorName}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
          priority
          onError={() => handleImageError(currentImage.url)}
        />
        
        {/* Navigation Arrows */}
        {validImages.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              onKeyDown={handleKeyDown}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-light-100/90 hover:bg-light-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-dark-900"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-dark-900" />
            </button>
            <button
              onClick={handleNext}
              onKeyDown={handleKeyDown}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-light-100/90 hover:bg-light-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-dark-900"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-dark-900" />
            </button>
          </>
        )}

        {/* Image Counter */}
        {validImages.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-dark-900/70 text-light-100 px-3 py-1 rounded-full text-caption">
            {selectedImageIndex + 1} / {validImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {validImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {validImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleThumbnailClick(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                index === selectedImageIndex
                  ? 'border-dark-900 ring-2 ring-dark-900/20'
                  : 'border-light-300 hover:border-dark-500'
              } focus:outline-none focus:ring-2 focus:ring-dark-900`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image.url}
                alt={`${productName} thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                onError={() => handleImageError(image.url)}
              />
            </button>
          ))}
        </div>
      )}

      {/* Color Swatches */}
      {variants.length > 1 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <p className="text-caption text-dark-700 font-medium">
              Color: <span className="text-dark-900">{currentVariant?.colorName}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {variants.map(variant => {
              const hasValidImages = variant.images.some(img => !imageErrors.has(img.url));
              return (
                <button
                  key={variant.id}
                  onClick={() => handleVariantChange(variant.id)}
                  disabled={!hasValidImages}
                  className={`relative w-10 h-10 rounded-full border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                    variant.id === selectedVariantId
                      ? 'border-dark-900 scale-110'
                      : 'border-light-300 hover:border-dark-500'
                  } focus:outline-none focus:ring-2 focus:ring-dark-900`}
                  style={{ backgroundColor: variant.colorValue }}
                  aria-label={`Select ${variant.colorName} color`}
                  title={variant.colorName}
                >
                  {variant.id === selectedVariantId && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-light-100 rounded-full shadow-md" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
