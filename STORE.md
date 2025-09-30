# Zustand State Management

## 📁 Store Structure

```
src/store/
├── index.ts          # Main store exports
├── cart.ts           # Shopping cart state
├── products.ts       # Product data state
└── auth.ts           # Authentication state
```

## 🛒 Cart Store (`useCartStore`)

### Features
- Add/remove items from cart
- Update quantities
- Calculate totals
- Cart visibility toggle
- Persistent storage

### Usage
```tsx
import { useCartStore } from "@/store/cart";

function MyComponent() {
  const { 
    items, 
    addItem, 
    removeItem, 
    getTotalItems, 
    getTotalPrice 
  } = useCartStore();
  
  // Add item to cart
  addItem({
    productId: 1,
    title: "Adidas Ultraboost",
    priceCents: 18000,
    currency: "USD",
    imageUrl: "https://...",
  });
}
```

### Methods
- `addItem(item, qty?)` - Add item to cart
- `removeItem(productId)` - Remove item from cart
- `updateQuantity(productId, qty)` - Update item quantity
- `clear()` - Clear entire cart
- `toggleCart()` - Toggle cart visibility
- `getTotalItems()` - Get total item count
- `getTotalPrice()` - Get total price in cents

## 📦 Products Store (`useProductStore`)

### Features
- Product data management
- Loading states
- Error handling
- Product filtering
- Persistent storage

### Usage
```tsx
import { useProductStore } from "@/store/products";

function MyComponent() {
  const { 
    products, 
    loading, 
    setProducts, 
    getProductById 
  } = useProductStore();
}
```

### Methods
- `setProducts(products)` - Set product list
- `setLoading(loading)` - Set loading state
- `setError(error)` - Set error state
- `getProductById(id)` - Get product by ID
- `getProductsByBrand(brand)` - Filter by brand

## 🔐 Auth Store (`useAuthStore`)

### Features
- User authentication state
- Login/logout functionality
- Persistent user data
- Loading states

### Usage
```tsx
import { useAuthStore } from "@/store/auth";

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout 
  } = useAuthStore();
}
```

### Methods
- `setUser(user)` - Set current user
- `setLoading(loading)` - Set loading state
- `login(user)` - Login user
- `logout()` - Logout user

## 🎯 Components Using Stores

### Cart Component
- Uses `useCartStore` for cart management
- Displays cart items, quantities, and totals
- Handles add/remove/update operations

### ProductCard Component
- Uses `useCartStore` for add to cart functionality
- Shows current item quantity in cart
- Handles cart interactions

### Header Component
- Uses `useCartStore` for cart button and item count
- Displays cart total and user icon

### HomeClient Component
- Uses `useProductStore` to sync server data
- Manages product state on client side

## 💾 Persistence

All stores use Zustand's `persist` middleware:
- Cart items persist across sessions
- Product data is cached
- Auth state is maintained

## 🔧 Store Configuration

Stores are configured with:
- TypeScript interfaces for type safety
- Persist middleware for data persistence
- Partialize for selective persistence
- Clean separation of concerns

## 🚀 Benefits

1. **Type Safety** - Full TypeScript support
2. **Performance** - Minimal re-renders
3. **Persistence** - Data survives page reloads
4. **Simplicity** - Easy to use and understand
5. **Scalability** - Easy to add new stores
