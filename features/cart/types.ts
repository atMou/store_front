import { Address } from "@/types";

export type CouponStatus =
  | "Unknown"
  | "AssignedToUser"
  | "AppliedToCart"
  | "Expired"
  | "Redeemed";

export interface CartItem {
  productId: string;
  colorVariantId: string;
  sizeVariantId: string;
  color: string;
  size: string;
  sku: string;
  slug: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Coupon {
  id: string;
  cartId?: string | null;
  userId?: string | null;
  code: string;
  description: string;
  discountValue: number;
  discountType: string;
  minimumPurchaseAmount: number;
  expiryDate: string;
  status: CouponStatus;
}

export interface Cart {
  userId: string;
  cartId: string;
  total: number;
  tax: number;
  totalSub: number;
  discount: number;
  totalDiscounted: number;
  shipmentCost: number;
  deliveryAddress: Address | null;
  coupons: Coupon[];
  lineItems: CartItem[];
}

export interface GetCartByIdRequest {
  id: string;
  include: ("lineItems" | "couponIds")[];
}

export interface AddLineItemRequest {
  cartId: string;
  productId: string;
  colorVariantId: string;
  sizeVariantId: string;
  quantity: number;
}

export interface LineItemRequest {
  productId: string;
  colorVariantId: string;
  sizeVariantId: string;
  quantity: number;
}

export interface AddMultipleLineItemsRequest {
  cartId: string;
  items: LineItemRequest[];
}

export interface UpdateLineItemRequest {
  cartId: string;
  productId: string;
  quantity: number;
}

export interface DeleteLineItemRequest {
  cartId: string;
  colorVariantId: string;
  sizeVariantId: string;
}

export interface AddCouponToCartRequest {
  cartId: string;
  couponId: string;
}

export interface RemoveCouponFromCartRequest {
  cartId: string;
  couponId: string;
}

export interface GetCouponsByUserIdRequest {
  userId: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface ChangeDeliveryAddressRequest {
  cartId: string;
  street: string;
  city: string;
  postalCode: number;
  houseNumber: number;
  extraDetails: string;
}

export interface CheckoutCartRequest {
  cartId: string;
}
