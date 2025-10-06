import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag, Star, Truck, Package, RotateCcw } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import SizePicker from '@/components/SizePicker';
import CollapsibleSection from '@/components/CollapsibleSection';
import { ProductCard } from '@/components/card';
import { notFound } from 'next/navigation';
import { getProduct, getRecommendedProducts } from '@/lib/actions/product';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // Fetch product data from database
  const productData = await getProduct(id);
  
  if (!productData || !productData.product.isPublished) {
    notFound();
  }

  const { product: dbProduct, variants: dbVariants, images: dbImages } = productData;

  // Early return if no variants
  if (dbVariants.length === 0) {
    notFound();
  }

  // Group variants by color
  const variantsByColor = new Map<string, typeof dbVariants>();
  dbVariants.forEach(variant => {
    const colorId = variant.colorId;
    if (!variantsByColor.has(colorId)) {
      variantsByColor.set(colorId, []);
    }
    variantsByColor.get(colorId)!.push(variant);
  });

  // Get product-level images (not linked to any variant)
  const productLevelImages = dbImages
    .filter(img => !img.variantId)
    .sort((a, b) => {
      if (a.isPrimary !== b.isPrimary) return b.isPrimary ? 1 : -1;
      return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
    });

  // Transform data for ProductGallery component
  const galleryVariants = Array.from(variantsByColor.entries()).map(([colorId, colorVariants]) => {
    const firstVariant = colorVariants[0];
    const color = firstVariant.color;
    
    // Get images for this color's variants
    const variantIds = colorVariants.map(v => v.id);
    const variantImages = dbImages
      .filter(img => img.variantId && variantIds.includes(img.variantId))
      .sort((a, b) => {
        if (a.isPrimary !== b.isPrimary) return b.isPrimary ? 1 : -1;
        return (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
      });

    // Use variant-specific images if available, otherwise fall back to product-level images
    const colorImages = variantImages.length > 0 ? variantImages : productLevelImages;

    return {
      id: colorId,
      colorName: color?.name || 'Unknown',
      colorValue: color?.hexCode || '#000000',
      images: colorImages.map(img => ({
        id: img.id,
        url: img.url,
        alt: `${dbProduct.name} - ${color?.name}`,
      })),
    };
  }).filter(v => v.images.length > 0); // Only include variants with images

  // Get all unique sizes across all variants, sorted by sortOrder
  const uniqueSizes = Array.from(
    new Map(
      dbVariants
        .filter(v => v.size)
        .map(v => [v.size!.id, v.size!])
    ).values()
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  // Transform sizes for SizePicker
  const sizes = uniqueSizes.map(size => ({
    id: size.id,
    value: size.name,
    available: dbVariants.some(v => v.sizeId === size.id && (v.inStock ?? 0) > 0),
  }));

  // Calculate price information
  const prices = dbVariants
    .map(v => ({
      price: parseFloat(v.price),
      salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
    }))
    .filter(p => !isNaN(p.price));

  const minPrice = Math.min(...prices.map(p => p.salePrice ?? p.price));
  const maxPrice = Math.max(...prices.map(p => p.price));
  const hasSalePrice = prices.some(p => p.salePrice !== null);
  const avgDiscount = hasSalePrice
    ? Math.round(
        prices
          .filter(p => p.salePrice !== null)
          .reduce((acc, p) => acc + ((p.price - p.salePrice!) / p.price) * 100, 0) /
          prices.filter(p => p.salePrice !== null).length
      )
    : 0;

  // Get recommended products
  const recommendedProducts = await getRecommendedProducts(id);

  // Transform product data for display
  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.gender?.label ? `${dbProduct.gender.label} Shoes` : 'Shoes',
    brand: dbProduct.brand?.name || 'Nike',
    price: minPrice,
    compareAtPrice: hasSalePrice ? maxPrice : null,
    discount: avgDiscount,
    rating: 4.5, // Placeholder - can be calculated from reviews
    reviewCount: 0, // Placeholder - can be fetched from reviews
    description: dbProduct.description,
    features: [
      'Premium materials for durability',
      'Comfortable fit for all-day wear',
      'Stylish design for any occasion',
      'Available in multiple colors and sizes',
    ],
    specifications: {
      'Brand': dbProduct.brand?.name || 'Nike',
      'Category': dbProduct.category?.name || 'Shoes',
      'Gender': dbProduct.gender?.label || 'Unisex',
      'Available Colors': galleryVariants.length.toString(),
    },
    variants: galleryVariants,
    sizes,
  };

  const hasDiscount = product.discount > 0;

  return (
    <div className="bg-light-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-caption text-dark-700 mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-dark-900">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link href="/products" className="hover:text-dark-900">Products</Link></li>
            <li><span className="mx-2">/</span></li>
            <li className="text-dark-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Product Gallery */}
          <div className="w-full">
            <ProductGallery 
              variants={product.variants}
              productName={product.name}
            />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Category */}
            <div>
              <h1 className="text-heading-3 md:text-heading-2 text-dark-900 mb-2">
                {product.name}
              </h1>
              <p className="text-body text-dark-700">{product.category}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-orange text-orange'
                        : 'fill-light-300 text-light-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-body text-dark-900 font-medium">
                {product.rating}
              </span>
              <span className="text-body text-dark-700">
                ({product.reviewCount} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-heading-3 text-dark-900 font-medium">
                ${product.price.toFixed(2)}
              </span>
              {hasDiscount && product.compareAtPrice && (
                <>
                  <span className="text-body-medium text-dark-700 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                  <span className="bg-red text-light-100 px-2 py-1 rounded text-caption font-medium">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="text-body text-dark-700 leading-relaxed">
              {product.description}
            </div>

            {/* Size Picker */}
            <SizePicker sizes={product.sizes} />

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                className="flex-1 bg-dark-900 text-light-100 py-4 px-6 rounded-lg font-medium text-body-medium hover:bg-dark-700 transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                aria-label="Add to bag"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
              <button
                className="w-14 h-14 border-2 border-light-300 rounded-lg flex items-center justify-center hover:border-dark-900 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
                aria-label="Add to favorites"
              >
                <Heart className="w-6 h-6 text-dark-900" />
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-light-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Truck className="w-5 h-5 text-dark-900 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-body-medium text-dark-900 font-medium">Free Delivery</p>
                  <p className="text-caption text-dark-700">
                    Enter your postal code for availability
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="w-5 h-5 text-dark-900 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-body-medium text-dark-900 font-medium">Free Returns</p>
                  <p className="text-caption text-dark-700">
                    30-day return policy
                  </p>
                </div>
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="border-t border-light-300 pt-4">
              <CollapsibleSection title="Product Details" defaultOpen>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-body-medium text-dark-900 font-medium mb-2">
                      Features
                    </h4>
                    <ul className="list-disc list-inside space-y-1">
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-body-medium text-dark-900 font-medium mb-2">
                      Specifications
                    </h4>
                    <dl className="grid grid-cols-2 gap-2">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <React.Fragment key={key}>
                          <dt className="text-dark-700">{key}:</dt>
                          <dd className="text-dark-900">{value}</dd>
                        </React.Fragment>
                      ))}
                    </dl>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title="Shipping & Returns">
                <div className="space-y-3">
                  <div>
                    <h4 className="text-body-medium text-dark-900 font-medium mb-1">
                      Shipping
                    </h4>
                    <p>
                      Free standard shipping on orders over $50. Express shipping available at checkout.
                      Orders typically arrive within 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="text-body-medium text-dark-900 font-medium mb-1">
                      Returns
                    </h4>
                    <p>
                      You have 30 days from the date of delivery to return your items for a full refund.
                      Items must be in original condition with tags attached.
                    </p>
                  </div>
                </div>
              </CollapsibleSection>

              <CollapsibleSection title={`Reviews (${product.reviewCount})`}>
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
              </CollapsibleSection>
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        {recommendedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-heading-3 text-dark-900 mb-6">
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  name={relatedProduct.title}
                  category="Shoes"
                  price={relatedProduct.price || 0}
                  image={relatedProduct.imageUrl}
                  href={`/products/${relatedProduct.id}`}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

// Generate metadata for SEO
export async function generateMetadata({ params }: ProductPageProps) {
  const { id } = await params;
  const productData = await getProduct(id);
  
  if (!productData || !productData.product.isPublished) {
    return {
      title: 'Product Not Found',
    };
  }

  const { product } = productData;
  const category = product.gender?.label ? `${product.gender.label} Shoes` : 'Shoes';

  return {
    title: `${product.name} - ${category}`,
    description: product.description,
  };
}