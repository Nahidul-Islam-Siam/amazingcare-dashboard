// src/redux/features/dashboard/paymentApi.ts
import { baseApi } from "@/redux/api/baseApi";

/** ===== Types aligned to /payment response ===== */
export interface Sender {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
}

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type PaymentMethod = "CARD" | "APPLE_PAY" | "GOOGLE_PAY" | "PAYPAL" | "BANK" | string;

export interface Payment {
  serial: number;
  id: string;
  senderId: string;
  amount: number;         // e.g. 49.99
  totalCoins: number;     // e.g. 5000
  currency: string;       // "USD"
  method: PaymentMethod;  // "CARD"
  paymentMethodId: string;
  status: PaymentStatus;  // "COMPLETED"
  transactionId: string;
  createdAt: string;      // ISO
  updatedAt: string;      // ISO
  sender: Sender;
}

export interface PaymentsMeta {
  page: number;
  limit: number;
  totalPayments: number;
  totalPages: number;
}

export interface GetPaymentsResponse {
  success: boolean;
  message: string;
  data: {
    meta: PaymentsMeta;
    data: Payment[];
  };
}

/** Optional query params (extend as needed) */
export interface PaymentsQuery {
  page?: number;
  limit?: number;
  search?: string;        // backend-defined (by tx id, email, etc.)
  sortBy?: string;        // e.g. "createdAt" | "amount"
  sortOrder?: "asc" | "desc";

}

/** ===== API slice ===== */
export const paymentApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPayments: build.query<GetPaymentsResponse, PaymentsQuery | void>({
      query: (params) => ({
        url: "/payment",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Payments"],
    }),
  }),
});

export const { useGetPaymentsQuery } = paymentApi;
