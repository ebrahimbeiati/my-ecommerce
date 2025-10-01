'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  colors?: number;
  badge?: {
    text: string;
    type: 'best-seller' | 'discount';
  };
  href?: string;
  className?: string;
}

export interface PromotionalCardProps {
  id: string;
  title: string;
  image: string;
  href?: string;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  category,
  price,
  image,
  colors,
  badge,
  href = '#',
  className = '',
}) => {
  const badgeStyles = {
    'best-seller': 'bg-orange text-light-100',
    discount: 'bg-green text-light-100',
  };

  return (
    <div className={`bg-light-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 ${className}`}>
      <Link href={href} className="block group">
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-200"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {badge && (
            <div className={`absolute top-3 left-3 px-2 py-1 rounded text-xs font-medium ${badgeStyles[badge.type]}`}>
              {badge.text}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-dark-900 text-body-medium mb-1 line-clamp-2">
            {name}
          </h3>
          <p className="text-dark-700 text-caption mb-2">
            {category}
          </p>
          {colors && (
            <p className="text-dark-500 text-caption mb-3">
              {colors} Colour{colors > 1 ? 's' : ''}
            </p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-dark-900 font-medium text-body-medium">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const PromotionalCard: React.FC<PromotionalCardProps> = ({
  id,
  title,
  image,
  href = '#',
  className = '',
}) => {
  return (
    <Link href={href} className={`block group ${className}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-light-100 font-medium text-heading-3 line-clamp-2">
            {title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

// Generic Card component that can render different card types
interface CardProps {
  type: 'product' | 'promotional';
  data: ProductCardProps | PromotionalCardProps;
  className?: string;
}

const Card: React.FC<CardProps> = ({ type, data, className }) => {
  if (type === 'product') {
    return <ProductCard {...(data as ProductCardProps)} className={className} />;
  }
  
  if (type === 'promotional') {
    return <PromotionalCard {...(data as PromotionalCardProps)} className={className} />;
  }
  
  return null;
};

export { ProductCard, PromotionalCard };
export default Card;
