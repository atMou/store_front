export interface Payment {
  id: string;
  total: number;
  status: string;
  method: string;
  date: string;
}

export interface CreatePaymentIntentRequest {
  cartId: string;
  currency?: string;
}

export interface CreatePaymentIntentResponse {
  paymentId: string;
  clientSecret: string;
  paymentIntentId: string;
  amount: number;
  currency: string;
}

export interface ConfirmPaymentRequest {
  paymentIntentId: string;
  cartId: string;
}

export interface ConfirmPaymentResponse {
  orderId: string;
  status: string;
  message: string;
}
