'use client';

import React, { useState } from 'react';

interface Size {
  id: string;
  value: string;
  available: boolean;
}

interface SizePickerProps {
  sizes: Size[];
}

export default function SizePicker({ sizes }: SizePickerProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const handleSizeSelect = (sizeId: string, available: boolean) => {
    if (available) {
      setSelectedSize(sizeId);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, sizeId: string, available: boolean) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleSizeSelect(sizeId, available);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-caption text-dark-700 font-medium">
          Select Size {selectedSize && (
            <span className="text-dark-900">
              - {sizes.find(s => s.id === selectedSize)?.value}
            </span>
          )}
        </p>
        <button className="text-caption text-dark-700 hover:text-dark-900 underline focus:outline-none focus:ring-2 focus:ring-dark-900 rounded">
          Size Guide
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {sizes.map((size) => (
          <button
            key={size.id}
            onClick={() => handleSizeSelect(size.id, size.available)}
            onKeyDown={(e) => handleKeyDown(e, size.id, size.available)}
            disabled={!size.available}
            className={`
              relative h-12 rounded-lg border-2 text-body-medium transition-all
              ${size.available 
                ? selectedSize === size.id
                  ? 'border-dark-900 bg-dark-900 text-light-100'
                  : 'border-light-300 hover:border-dark-900 text-dark-900'
                : 'border-light-300 text-dark-500 cursor-not-allowed opacity-50'
              }
              focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2
            `}
            aria-label={`Size ${size.value}${size.available ? '' : ' - Out of stock'}`}
            aria-pressed={selectedSize === size.id}
          >
            <span className={!size.available ? 'line-through' : ''}>
              {size.value}
            </span>
          </button>
        ))}
      </div>

      {!selectedSize && (
        <p className="text-caption text-dark-700">
          Please select a size to continue
        </p>
      )}
    </div>
  );
}
