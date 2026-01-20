# Payment Feature

Stripe-integrated payment processing for the e-commerce platform.

## Overview

This feature handles secure payment processing using Stripe, including payment intent creation, payment confirmation, and order creation.

## Architecture

```
features/payment/
├── api.ts                    # RTK Query endpoints
├── types.ts                  # TypeScript interfaces
├── slice.ts                  # Redux state (if needed)
├── index.ts                  # Public exports
└── components/
    ├── StripeProvider.tsx    # Stripe Elements wrapper
    ├── CheckoutForm.tsx      # Payment form component
    └── index.ts              # Component exports
```

## Components

### StripeProvider

Wrapper component that initializes Stripe Elements with customized appearance.

**Props:**

- `clientSecret: string` - Payment intent client secret from backend
- `children: ReactNode` - Child components (typically CheckoutForm)

**Usage:**

```tsx
<StripeProvider clientSecret={clientSecret}>
  <CheckoutForm {...props} />
</StripeProvider>
```

### CheckoutForm

Payment form using Stripe Elements for secure card input.

**Props:**

- `cartId: string` - Cart identifier
- `paymentIntentId: string` - Stripe payment intent ID
- `amount: number` - Total amount in cents

**Features:**

- Secure card input via Stripe Elements
- Real-time validation
- Loading states
- Error handling
- Automatic payment confirmation
- Redirect to success page

## API Endpoints

### `createPaymentIntent`

Creates a Stripe payment intent for the cart.

```typescript
const [createPaymentIntent] = useCreatePaymentIntentMutation();

const response = await createPaymentIntent({
  cartId: "cart-id",
  currency: "usd",
}).unwrap();

// Returns: { clientSecret, paymentIntentId, amount, currency }
```

### `confirmPayment`

Confirms payment and creates order after successful Stripe payment.

```typescript
const [confirmPayment] = useConfirmPaymentMutation();

const response = await confirmPayment({
  paymentIntentId: "pi_xxx",
  cartId: "cart-id",
}).unwrap();

// Returns: { orderId, status, message }
```

## Checkout Flow

1. User navigates to `/checkout`
2. Page loads cart data via `useGetCartByUserIdQuery`
3. Payment intent is created via `createPaymentIntent` mutation
4. Stripe Elements renders with client secret
5. User enters payment details
6. On submit:
   - Stripe validates and processes payment
   - Frontend confirms payment with `confirmPayment`
   - Backend creates order and clears cart
   - User redirected to `/success?orderId=xxx`

## Payment Pages

### Checkout Page

- **Route:** `/checkout`
- **Auth:** Required (protected by `WithAuth` HOC)
- **Features:**
  - Order summary with line items
  - Delivery address display
  - Applied coupons
  - Stripe payment form
  - Real-time validation

### Success Page

- **Route:** `/success?orderId=xxx`
- **Features:**
  - Confirmation message
  - Order ID display
  - Links to view orders, continue shopping, contact support

### Failure Page

- **Route:** `/failure`
- **Features:**
  - Error message
  - Retry options
  - Support links

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxx
```

## Security Features

1. **Client-side:**
   - Stripe Elements (PCI-compliant card input)
   - No card data touches your servers
   - Client secret required for payment

2. **Backend:**
   - Payment verification before order creation
   - User authorization checks
   - Webhook signature validation
   - Idempotency handling

## Error Handling

The payment flow handles:

- Empty cart scenarios
- Invalid payment intents
- Failed payments
- Network errors
- Stripe API errors

All errors display user-friendly messages via toast notifications.

## Integration with Backend

See [STRIPE_BACKEND_IMPLEMENTATION.md](../../STRIPE_BACKEND_IMPLEMENTATION.md) for:

- Controller implementation
- Service layer setup
- Webhook handling
- Database models

## Testing

### Test Cards

Use Stripe test cards in development:

| Card Number         | Scenario                            |
| ------------------- | ----------------------------------- |
| 4242 4242 4242 4242 | Success                             |
| 4000 0000 0000 0002 | Card declined                       |
| 4000 0025 0000 3155 | Requires authentication (3D Secure) |

**Test details:**

- Expiry: Any future date
- CVC: Any 3 digits
- Postal: Any 5 digits

### Local Testing

1. Start backend: `dotnet run`
2. Start frontend: `npm run dev`
3. Add items to cart
4. Navigate to checkout
5. Use test card for payment

## Customization

### Appearance

Modify Stripe Elements theme in [StripeProvider.tsx](./components/StripeProvider.tsx):

```typescript
appearance: {
  theme: 'stripe', // or 'night', 'flat'
  variables: {
    colorPrimary: '#0F172A',
    borderRadius: '8px',
    // ... more customization
  }
}
```

### Payment Methods

To enable additional payment methods (Apple Pay, Google Pay, etc.):

1. Update backend `PaymentIntentCreateOptions`:

```csharp
AutomaticPaymentMethods = new PaymentIntentAutomaticPaymentMethodsOptions
{
    Enabled = true,
}
```

2. Payment methods will auto-display based on customer's device

## Related Features

- **Cart** (`features/cart`) - Provides cart data for checkout
- **Auth** (`features/auth`) - User authentication for payments
- **Orders** - Created after successful payment

## Troubleshooting

### "Invalid API key"

- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in `.env.local`
- Verify backend Stripe secret key in `appsettings.json`

### Payment intent creation fails

- Verify cart has items
- Check cart belongs to authenticated user
- Ensure backend endpoint is accessible

### Payment succeeds but order not created

- Check webhook configuration
- Verify `confirmPayment` endpoint is called
- Review backend logs for errors

## Future Enhancements

- [ ] Save payment methods for faster checkout
- [ ] Support for multiple currencies
- [ ] Subscription payments
- [ ] Refund functionality
- [ ] Payment history page
- [ ] Email receipts
- [ ] Split payments
