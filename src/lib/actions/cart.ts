"use server";

import { db } from "@/lib/db";
import { carts, cartItems, guests, productVariants, products, productImages } from "@/lib/db/schema";
import { eq, and, or, isNull } from "drizzle-orm";
import { getCurrentUser } from "@/lib/auth/actions";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Get or create a cart for the current user/guest
 */
async function getOrCreateCart() {
  const user = await getCurrentUser();
  const cookieStore = await cookies();
  const guestToken = cookieStore.get("guest_session")?.value;

  if (user) {
    let cart = await db.query.carts.findFirst({
      where: eq(carts.userId, user.id),
    });

    if (!cart) {
      const [newCart] = await db
        .insert(carts)
        .values({ userId: user.id, guestId: null })
        .returning();
      cart = newCart;
    }

    return cart;
  }

  if (!guestToken) return null;

  const guest = await db.query.guests.findFirst({
    where: eq(guests.sessionToken, guestToken),
  });

  if (!guest) return null;

  let cart = await db.query.carts.findFirst({
    where: eq(carts.guestId, guest.id),
  });

  if (!cart) {
    const [newCart] = await db
      .insert(carts)
      .values({ userId: null, guestId: guest.id })
      .returning();
    cart = newCart;
  }

  return cart;
}

/**
 * Get the current cart with all items, product details, and images
 */
export async function getCart() {
  try {
    const cart = await getOrCreateCart();

    if (!cart) {
      return {
        success: true,
        cart: null,
        items: [],
        total: 0,
        itemCount: 0,
      };
    }

    // Fetch cart items with product details
    const items = await db
      .select({
        id: cartItems.id,
        cartId: cartItems.cartId,
        productVariantId: cartItems.productVariantId,
        quantity: cartItems.quantity,
        // Variant details
        variantSku: productVariants.sku,
        variantPrice: productVariants.price,
        variantSalePrice: productVariants.salePrice,
        variantInStock: productVariants.inStock,
        // Product details
        productId: products.id,
        productName: products.name,
        productDescription: products.description,
      })
      .from(cartItems)
      .innerJoin(productVariants, eq(cartItems.productVariantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(eq(cartItems.cartId, cart.id));

    // Fetch primary images for each product
    const itemsWithImages = await Promise.all(
      items.map(async (item) => {
        const image = await db.query.productImages.findFirst({
          where: and(
            eq(productImages.productId, item.productId),
            or(
              eq(productImages.variantId, item.productVariantId),
              isNull(productImages.variantId)
            )
          ),
          orderBy: (productImages, { desc }) => [desc(productImages.isPrimary)],
        });

        const price = item.variantSalePrice
          ? parseFloat(item.variantSalePrice)
          : parseFloat(item.variantPrice);

        return {
          id: item.id,
          cartId: item.cartId,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
          productId: item.productId,
          productName: item.productName,
          sku: item.variantSku,
          price,
          originalPrice: parseFloat(item.variantPrice),
          salePrice: item.variantSalePrice ? parseFloat(item.variantSalePrice) : null,
          inStock: item.variantInStock,
          imageUrl: image?.url || null,
          subtotal: price * item.quantity,
        };
      })
    );

    const total = itemsWithImages.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = itemsWithImages.reduce((sum, item) => sum + item.quantity, 0);

    return {
      success: true,
      cart,
      items: itemsWithImages,
      total,
      itemCount,
    };
  } catch (error) {
    console.error("Error fetching cart:", error);
    return {
      success: false,
      error: "Failed to fetch cart",
      cart: null,
      items: [],
      total: 0,
      itemCount: 0,
    };
  }
}

/**
 * Add an item to the cart or update quantity if it already exists
 */
export async function addCartItem(productVariantId: string, quantity: number = 1) {
  try {
    if (quantity < 1) {
      return { success: false, error: "Quantity must be at least 1" };
    }

    const variant = await db.query.productVariants.findFirst({
      where: eq(productVariants.id, productVariantId),
    });

    if (!variant) {
      return { success: false, error: "Product variant not found" };
    }

    if (variant.inStock < quantity) {
      return { success: false, error: "Not enough stock available" };
    }

    const cart = await getOrCreateCart();

    if (!cart) {
      return { success: false, error: "Unable to create cart. Please enable cookies." };
    }

    const existingItem = await db.query.cartItems.findFirst({
      where: and(
        eq(cartItems.cartId, cart.id),
        eq(cartItems.productVariantId, productVariantId)
      ),
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      
      if (variant.inStock < newQuantity) {
        return { success: false, error: "Not enough stock available" };
      }

      await db
        .update(cartItems)
        .set({ quantity: newQuantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      await db.insert(cartItems).values({
        cartId: cart.id,
        productVariantId,
        quantity,
      });
    }

    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    revalidatePath("/cart");
    revalidatePath("/products");

    return { success: true, message: "Item added to cart" };
  } catch (error) {
    console.error("Error adding cart item:", error);
    return { 
      success: false, 
      error: "Failed to add item to cart"
    };
  }
}

/**
 * Update the quantity of a cart item
 */
export async function updateCartItem(cartItemId: string, quantity: number) {
  try {
    if (quantity < 0) {
      return { success: false, error: "Invalid quantity" };
    }

    if (quantity === 0) {
      return await removeCartItem(cartItemId);
    }

    // Get the cart item and verify ownership
    const item = await db.query.cartItems.findFirst({
      where: eq(cartItems.id, cartItemId),
      with: {
        cart: true,
        variant: true,
      },
    });

    if (!item) {
      return { success: false, error: "Cart item not found" };
    }

    // Verify user owns this cart
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const guestToken = cookieStore.get("guest_session")?.value;

    const ownsCart =
      (user && item.cart.userId === user.id) ||
      (!user && guestToken && item.cart.guestId);

    if (!ownsCart) {
      return { success: false, error: "Unauthorized" };
    }

    // Check stock availability
    if (item.variant.inStock < quantity) {
      return { success: false, error: "Not enough stock available" };
    }

    // Update quantity
    await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, cartItemId));

    // Update cart timestamp
    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, item.cartId));

    revalidatePath("/cart");

    return { success: true, message: "Cart updated" };
  } catch (error) {
    console.error("Error updating cart item:", error);
    return { success: false, error: "Failed to update cart item" };
  }
}

/**
 * Remove an item from the cart
 */
export async function removeCartItem(cartItemId: string) {
  try {
    // Get the cart item and verify ownership
    const item = await db.query.cartItems.findFirst({
      where: eq(cartItems.id, cartItemId),
      with: {
        cart: true,
      },
    });

    if (!item) {
      return { success: false, error: "Cart item not found" };
    }

    // Verify user owns this cart
    const user = await getCurrentUser();
    const cookieStore = await cookies();
    const guestToken = cookieStore.get("guest_session")?.value;

    const ownsCart =
      (user && item.cart.userId === user.id) ||
      (!user && guestToken && item.cart.guestId);

    if (!ownsCart) {
      return { success: false, error: "Unauthorized" };
    }

    // Delete the item
    await db.delete(cartItems).where(eq(cartItems.id, cartItemId));

    // Update cart timestamp
    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, item.cartId));

    revalidatePath("/cart");

    return { success: true, message: "Item removed from cart" };
  } catch (error) {
    console.error("Error removing cart item:", error);
    return { success: false, error: "Failed to remove item from cart" };
  }
}

/**
 * Clear all items from the cart
 */
export async function clearCart() {
  try {
    const cart = await getOrCreateCart();

    if (!cart) {
      return { success: false, error: "Cart not found" };
    }

    // Delete all cart items
    await db.delete(cartItems).where(eq(cartItems.cartId, cart.id));

    // Update cart timestamp
    await db
      .update(carts)
      .set({ updatedAt: new Date() })
      .where(eq(carts.id, cart.id));

    revalidatePath("/cart");

    return { success: true, message: "Cart cleared" };
  } catch (error) {
    console.error("Error clearing cart:", error);
    return { success: false, error: "Failed to clear cart" };
  }
}

/**
 * Merge guest cart into user cart after login/signup
 * This is called automatically by the auth actions
 */
export async function mergeGuestCart(userId: string) {
  try {
    const cookieStore = await cookies();
    const guestToken = cookieStore.get("guest_session")?.value;

    if (!guestToken) {
      return { success: true, message: "No guest cart to merge" };
    }

    // Find guest
    const guest = await db.query.guests.findFirst({
      where: eq(guests.sessionToken, guestToken),
    });

    if (!guest) {
      return { success: true, message: "Guest not found" };
    }

    // Find guest cart
    const guestCart = await db.query.carts.findFirst({
      where: eq(carts.guestId, guest.id),
      with: {
        items: true,
      },
    });

    if (!guestCart || guestCart.items.length === 0) {
      return { success: true, message: "No items in guest cart" };
    }

    // Find or create user cart
    let userCart = await db.query.carts.findFirst({
      where: eq(carts.userId, userId),
    });

    if (!userCart) {
      const [newCart] = await db
        .insert(carts)
        .values({
          userId,
          guestId: null,
        })
        .returning();
      userCart = newCart;
    }

    // Merge items
    for (const item of guestCart.items) {
      const existingItem = await db.query.cartItems.findFirst({
        where: and(
          eq(cartItems.cartId, userCart.id),
          eq(cartItems.productVariantId, item.productVariantId)
        ),
      });

      if (existingItem) {
        // Update quantity
        await db
          .update(cartItems)
          .set({ quantity: existingItem.quantity + item.quantity })
          .where(eq(cartItems.id, existingItem.id));
      } else {
        // Add new item to user cart
        await db.insert(cartItems).values({
          cartId: userCart.id,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        });
      }
    }

    // Delete guest cart
    await db.delete(cartItems).where(eq(cartItems.cartId, guestCart.id));
    await db.delete(carts).where(eq(carts.id, guestCart.id));

    revalidatePath("/cart");

    return { success: true, message: "Cart merged successfully" };
  } catch (error) {
    console.error("Error merging guest cart:", error);
    return { success: false, error: "Failed to merge cart" };
  }
}
