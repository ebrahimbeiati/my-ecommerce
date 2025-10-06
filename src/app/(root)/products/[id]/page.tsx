import React, { Suspense } from 'react';
import Link from 'next/link';
import { PackageX } from 'lucide-react';
import ProductGallery from '@/components/ProductGallery';
import ProductDetails from '@/components/ProductDetails';
import CollapsibleSection from '@/components/CollapsibleSection';
import ReviewsSection from '@/components/ReviewsSection';
import RecommendedProducts from '@/components/RecommendedProducts';
import { ReviewsSkeleton, RecommendedProductsSkeleton } from '@/components/LoadingSkeletons';
import { getProduct } from '@/lib/actions/product';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Custom Not Found Component
function ProductNotFound() {
  return (
    <div className="bg-light-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <PackageX className="w-24 h-24 text-dark-500 mx-auto mb-6" />
          <h1 className="text-heading-2 text-dark-900 mb-4">Product Not Found</h1>
          <p className="text-body text-dark-700 mb-8 max-w-md mx-auto">
            The product you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/products"
              className="px-6 py-3 bg-dark-900 text-light-100 rounded-lg font-medium hover:bg-dark-700 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
            >
              Browse All Products
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-light-200 text-dark-900 rounded-lg font-medium hover:bg-light-300 transition-colors focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reviews Section Wrapper with Error Handling
async function ReviewsSectionWrapper({ productId }: { productId: string }) {
  try {
    return <ReviewsSection productId={productId} />;
  } catch (error) {
    console.error('Error loading reviews:', error);
    // Return empty reviews component silently
    return (
      <CollapsibleSection title="Reviews (0)" defaultOpen={false}>
        <div className="text-center py-8">
          <p className="text-body text-dark-700">
            Reviews are temporarily unavailable.
          </p>
        </div>
      </CollapsibleSection>
    );
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  
  // Fetch product data from database
  const productData = await getProduct(id);
  
  // Show custom not found if product doesn't exist or isn't published
  if (!productData || !productData.product.isPublished) {
    return <ProductNotFound />;
  }

  const { product: dbProduct, variants: dbVariants, images: dbImages } = productData;

  // Early return if no variants
  if (dbVariants.length === 0) {
    return <ProductNotFound />;
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

  // Transform sizes for SizePicker with variant IDs
  const sizes = uniqueSizes.map(size => {
    // Find the first available variant with this size (prefer with stock)
    const variantWithSize = dbVariants
      .filter(v => v.sizeId === size.id)
      .sort((a, b) => (b.inStock ?? 0) - (a.inStock ?? 0))[0];
    
    return {
      id: size.id,
      value: size.name,
      available: dbVariants.some(v => v.sizeId === size.id && (v.inStock ?? 0) > 0),
      variantId: variantWithSize?.id
    };
  });

  // Calculate price information
  const prices = dbVariants
    .map(v => ({
      price: parseFloat(v.price),
      salePrice: v.salePrice ? parseFloat(v.salePrice) : null,
    }))
    .filter(p => !isNaN(p.price) && p.price > 0);

  // Guard against empty prices array
  if (prices.length === 0) {
    return <ProductNotFound />;
  }

  const minPrice = Math.min(...prices.map(p => p.salePrice ?? p.price));
  const maxPrice = Math.max(...prices.map(p => p.price));
  const hasSalePrice = prices.some(p => p.salePrice !== null);
  const salePrices = prices.filter(p => p.salePrice !== null);
  const avgDiscount = hasSalePrice && salePrices.length > 0
    ? Math.round(
        salePrices.reduce((acc, p) => acc + ((p.price - p.salePrice!) / p.price) * 100, 0) /
          salePrices.length
      )
    : 0;

  // Guard against products with no valid images
  if (galleryVariants.length === 0) {
    return <ProductNotFound />;
  }

  // Transform product data for display
  const product = {
    id: dbProduct.id,
    name: dbProduct.name,
    category: dbProduct.gender?.label ? `${dbProduct.gender.label} Shoes` : 'Shoes',
    brand: dbProduct.brand?.name || 'Nike',
    price: minPrice,
    compareAtPrice: hasSalePrice ? maxPrice : undefined,
    discount: avgDiscount,
    rating: 4.5, // Placeholder - can be calculated from reviews
    reviewCount: 0, // Placeholder - can be fetched from reviews
    description: dbProduct.description || 'No description available.',
    defaultVariantId: dbProduct.defaultVariantId,
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
          <div>
            <ProductDetails product={product} />

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

              {/* Reviews Section - Wrapped in Suspense with Error Boundary */}
              <Suspense fallback={<ReviewsSkeleton />}>
                <ReviewsSectionWrapper productId={id} />
              </Suspense>
            </div>
          </div>
        </div>

        {/* You Might Also Like - Wrapped in Suspense */}
        <Suspense fallback={<RecommendedProductsSkeleton />}>
          <RecommendedProducts productId={id} />
        </Suspense>
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