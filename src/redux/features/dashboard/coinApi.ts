// src/redux/features/dashboard/giftCarApi.ts
import { baseApi } from "@/redux/api/baseApi";

/** === Interfaces aligned to /coins API === */
export interface Coin {
  id: string;
  image: string;        // URL
  coinAmount: string;   // API returns string (e.g., "1000")
  price: number;        // number
  createdAt: string;    // ISO
  updatedAt: string;    // ISO
}

export interface GetCoinsResponse {
  success: boolean;
  message: string;
  data: Coin[];
}

export interface CoinQueryParams {
  // keep flexible; passthrough to backend
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  minAmount?: number; // if your API supports
  maxAmount?: number; // if your API supports
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AddCoinResponse {
  success: boolean;
  message: string;
  data: Coin;
}

/** === API Endpoints ===
 * NOTE: We keep endpoint *names* the same (getGiftCards/addGiftCard)
 * so your existing imports like `useGetGiftCardsQuery` keep working.
 * Under the hood they hit /coins and use Coin types.
 */
export const coinApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // GET /coins
    getCoins: build.query<GetCoinsResponse, CoinQueryParams | void>({
      query: (params) => ({
        url: "/coins",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["Coins"],
    }),

addCoin: build.mutation({
  query: (body) => ({
    url: "/coins",
    method: "POST",
    body,
  }),
  invalidatesTags: ["Coins"],
}),


    deleteCoin: build.mutation<AddCoinResponse, string>({
      query: (id) => ({
        url: `/coins/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Coins"],
    })
  }),
});

/** === Hooks (kept same names to avoid breaking imports) === */
export const { useGetCoinsQuery, useAddCoinMutation, useDeleteCoinMutation } = coinApi;
