# Order Feature

Complete order management feature with RTK Query integration for fetching and displaying order information.

## Structure

```
features/order/
├── api.ts                  # RTK Query endpoints
├── slice.ts                # Redux state management
├── types.ts                # TypeScript interfaces
├── hooks/
│   ├── index.ts           # Hooks exports
│   └── useOrder.ts        # Order hooks
├── components/
│   ├── index.ts           # Component exports
│   ├── OrderDetailPage.tsx # Order detail view
│   └── OrdersList.tsx      # Orders list view
└── index.ts               # Feature exports
```

## API Endpoints

### Get Order by ID

Fetches a single order by its ID.

**Backend Endpoint:** `GET /orders/{orderId}`

**Response Type:** `OrderResult`

```typescript
interface Order {
  orderId: string;
  userId: string;
  email: string;
  phone?: string | null;
  shipmentId?: string | null;
  paymentId?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
  trackingCode: string;
  orderStatus: string;
  couponIds: string[];
  shippingAddress: Address;
  notes: string;
  orderItems: OrderItem[];
}
```

### Get Orders by User ID

Fetches all orders for a specific user.

**Backend Endpoint:** `GET /orders/user/{userId}`

**Response Type:** `Order[]`

## Hooks

### `useOrder()`

Main hook for accessing order state from Redux.

```typescript
const {
  currentOrder, // Current order being viewed
  orders, // List of all orders
  isLoading, // Loading state
  error, // Error object
  errorDetail, // Error detail message
  errorMessages, // Array of error messages
  hasError, // Boolean indicating error state
  clearCurrentOrder, // Clear current order
  clearOrders, // Clear orders list
  clearError, // Clear error state
} = useOrder();
```

### `useOrderById(orderId, skip)`

Fetches a single order by ID using RTK Query.

```typescript
const { order, isLoading, error, refetch } = useOrderById(orderId);
```

**Parameters:**

- `orderId`: string | null - The order ID to fetch
- `skip`: boolean (optional) - Skip the query if true

**Returns:**

- `order`: Order | undefined - The fetched order
- `isLoading`: boolean - Loading state
- `error`: any - Error object
- `refetch`: () => void - Refetch function

### `useOrdersByUserId(userId, skip)`

Fetches all orders for a user using RTK Query.

```typescript
const { orders, isLoading, error, refetch } = useOrdersByUserId(userId);
```

**Parameters:**

- `userId`: string | null - The user ID
- `skip`: boolean (optional) - Skip the query if true

**Returns:**

- `orders`: Order[] - Array of orders
- `isLoading`: boolean - Loading state
- `error`: any - Error object
- `refetch`: () => void - Refetch function

## Components

### OrderDetailPage

Full page component for displaying order details.

**Usage:**

```tsx
import { OrderDetailPage } from "@/features/order/components";

// In app/(private)/orders/[orderId]/page.tsx
export default function OrderPage() {
  return <OrderDetailPage />;
}
```

**Features:**

- Displays order items with images
- Shows order summary (subtotal, tax, discount, total)
- Shipping address display
- Contact information
- Applied coupons
- Order status badge with color coding
- Loading and error states

### OrdersList

Component for displaying a list of user's orders.

**Usage:**

```tsx
import { OrdersList } from "@/features/order/components";

// In app/(private)/orders/page.tsx
export default function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <OrdersList />
    </div>
  );
}
```

**Features:**

- Lists all orders for the authenticated user
- Order status badges
- Quick summary (tracking code, item count, total)
- Click to view order details
- Empty state for no orders
- Loading skeleton
- Error handling with retry

## Types

### Order

Main order interface.

```typescript
interface Order {
  orderId: string;
  userId: string;
  email: string;
  phone?: string | null;
  shipmentId?: string | null;
  paymentId?: string | null;
  subtotal: number;
  tax: number;
  total: number;
  discount: number;
  trackingCode: string;
  orderStatus: string;
  couponIds: string[];
  shippingAddress: Address;
  notes: string;
  orderItems: OrderItem[];
}
```

### OrderItem

Individual item in an order.

```typescript
interface OrderItem {
  productId: string;
  colorVariantId: string;
  slug: string;
  sku: string;
  size: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
}
```

### Address

Shipping address information.

```typescript
interface Address {
  street: string;
  city: string;
  postalCode: number;
  houseNumber: number;
  extraDetails?: string | null;
}
```

### OrderStatus

Available order statuses.

```typescript
type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled"
  | "Refunded";
```

## Usage Examples

### Fetching a Single Order

```tsx
"use client";

import { useOrderById } from "@/features/order/hooks";
import { useParams } from "next/navigation";

export default function OrderPage() {
  const params = useParams();
  const orderId = params?.orderId as string;

  const { order, isLoading, error, refetch } = useOrderById(orderId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading order</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div>
      <h1>Order #{order.trackingCode}</h1>
      <p>Status: {order.orderStatus}</p>
      <p>Total: ${order.total.toFixed(2)}</p>
      {/* Display order items, shipping info, etc. */}
    </div>
  );
}
```

### Fetching User's Orders

```tsx
"use client";

import { useOrdersByUserId } from "@/features/order/hooks";
import { useAuth } from "@/hooks/state/useAuth";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const { orders, isLoading, error } = useOrdersByUserId(user?.userId ?? null);

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div>
      <h1>My Orders</h1>
      {orders.map((order) => (
        <div key={order.orderId}>
          <p>Order #{order.trackingCode}</p>
          <p>Status: {order.orderStatus}</p>
          <p>Total: ${order.total.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

### Using Order State from Redux

```tsx
"use client";

import { useOrder } from "@/features/order/hooks";

export default function OrderSummary() {
  const { currentOrder, isLoading, hasError, errorDetail } = useOrder();

  if (isLoading) return <div>Loading...</div>;
  if (hasError) return <div>Error: {errorDetail}</div>;
  if (!currentOrder) return <div>No order selected</div>;

  return (
    <div>
      <h2>Order Summary</h2>
      <p>Subtotal: ${currentOrder.subtotal.toFixed(2)}</p>
      <p>Tax: ${currentOrder.tax.toFixed(2)}</p>
      <p>Total: ${currentOrder.total.toFixed(2)}</p>
    </div>
  );
}
```

## State Management

The order feature uses Redux for state management with the following structure:

```typescript
interface OrderState {
  currentOrder: Order | null;
  orders: Order[];
  isLoading: boolean;
  error: {
    detail: string;
    errors: string[];
  } | null;
}
```

## Integration

The order reducer is automatically integrated into the Redux store at:

```typescript
store: {
  order: OrderState,
  // ... other reducers
}
```

## Notes

- All API calls automatically update Redux state
- RTK Query provides automatic caching and refetching
- The "Order" tag is used for cache invalidation
- All monetary values are in the currency defined by the backend (default: USD)
- Order status colors are automatically applied in the UI components
