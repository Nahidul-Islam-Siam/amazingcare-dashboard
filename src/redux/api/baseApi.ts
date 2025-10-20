/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://10.0.20.132:5002/api/v1", 
    baseUrl: "http://72.60.70.222:12002/api/v1", 
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("Authorization", `${token}`);
      }

      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Post",
    "Auth",
    "Restaurants",
    "overview",
    "Hotel",
    "Tourist",
    "Bar",
    "Beach",
    "Fashion",
    "Review",
    "ServiceList",
    "GiftCard",
    "Dashboard",
    "Coins",
    "Profile",
    "Users",
    "Payments",
    "Managers",
    "Reports",
    "Chat",
    "Subscriptions"
  ],
  endpoints: () => ({}),
});
