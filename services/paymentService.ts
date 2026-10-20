import axiosInstance from "@/api/axiosInstance";

// ── Types ──────────────────────────────────────────────────────────────────

export interface SubscriptionPlan {
  id: number;
  name: string;
  planType:
    | "BASIC"
    | "SILVER"
    | "GOLD"
    | "GOLD_PLUS"
    | "PLATINUM"
    | "PLATINUM_PLUS"
    | "DIAMOND"
    | "REGISTRATION"
    | "TEST";
  price: number;
  durationDays: number;
  description: string;
  isActive: boolean;
}

export interface CreateOrderResponse {
  razorpayOrderId: string;
  razorpayKeyId: string;
  amount: number;
  currency: string;
  paymentId: number;
  plan: SubscriptionPlan;
}

export interface PaymentVerificationRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentRecord {
  id: number;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  amount: number;
  currency: string;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  plan: SubscriptionPlan;
  createdAt: string;
  updatedAt: string;
}

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

// ── API Calls ──────────────────────────────────────────────────────────────

/** GET /payments/plans — public, no auth required */
export const getSubscriptionPlans = async (): Promise<SubscriptionPlan[]> => {
  const res = await axiosInstance.get<ApiEnvelope<SubscriptionPlan[]>>("/payments/plans");
  return res.data.data ?? [];
};

/** POST /payments/create-order — creates a Razorpay order */
export const createPaymentOrder = async (planId: number): Promise<CreateOrderResponse> => {
  const res = await axiosInstance.post<ApiEnvelope<CreateOrderResponse>>(
    "/payments/create-order",
    { planId }
  );
  return res.data.data;
};

/** POST /payments/verify — verifies payment and activates subscription */
export const verifyPayment = async (
  payload: PaymentVerificationRequest
): Promise<PaymentRecord> => {
  const res = await axiosInstance.post<ApiEnvelope<PaymentRecord>>(
    "/payments/verify",
    payload
  );
  return res.data.data;
};

/** GET /payments/history — logged-in user's payment history */
export const getPaymentHistory = async (): Promise<PaymentRecord[]> => {
  const res = await axiosInstance.get<ApiEnvelope<PaymentRecord[]>>("/payments/history");
  return res.data.data ?? [];
};
