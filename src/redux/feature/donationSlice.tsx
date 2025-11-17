"use client";

import baseApi from "../Api/baseApi";

export const donationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    donation: builder.mutation({
      query: (data) => ({
        url: "/donation/create-checkout-session/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useDonationMutation } = donationApi;
