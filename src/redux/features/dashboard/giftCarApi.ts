// src/redux/features/dashboard/giftCarApi.ts

import { baseApi } from "@/redux/api/baseApi";

// === Define Interfaces ===

export interface GiftCard {
  id: string;
  name: string | null;
  gender: string; // e.g. "EVERYONE", "HIM"
  category: string; // e.g. "MAJESTIC"
  image: string; // URL
  price: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface GetGiftCardsResponse {
  success: boolean;
  message: string;
  data: GiftCard[];
}

/**
 * Query params for filtering gift cards
 */
export interface GiftCardQueryParams {
  type?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

/**
 * Response shape for create operation
 */
export interface AddGiftCardResponse {
  success: boolean;
  message: string;
  data: GiftCard;
}

// === API Endpoints ===
export const giftCardApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // ✅ GET all gift cards
    getGiftCards: build.query<GetGiftCardsResponse, GiftCardQueryParams | void>({
      query: (params) => ({
        url: "/gift-card",
        method: "GET",
        params: params ?? {},
      }),
      providesTags: ["GiftCard"],
    }),

    // 🚀 POST new gift card with form-data
    addGiftCard: build.mutation<AddGiftCardResponse, FormData>({
      query: (formData) => ({
        url: "/gift-card",
        method: "POST",
        body: formData,
        // 👇 Important: Don't set headers manually — RTK will handle multipart
      }),
      invalidatesTags: ["GiftCard"],
    }),

    deleteGiftCard: build.mutation<AddGiftCardResponse, string>({
      query: (id) => ({
        url: `/gift-card/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GiftCard"],
    }),
  }),
});

// === Export Hooks ===
export const { useGetGiftCardsQuery, useAddGiftCardMutation, useDeleteGiftCardMutation } = giftCardApi;