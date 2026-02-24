"use client";

import baseApi from "../Api/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
//    /chat/conversations/
    getInbox: builder.query({
      query: () => ({
        url: `/chat/conversations/`,
        method: "GET",
      }),
        providesTags: ["Chat"],
    }),
    // /chat/conversations/9c5f0252-d524-40b2-80dc-23e18c033d30/messages/
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/messages/`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
  }),
});

export const {
    useGetInboxQuery,
    useGetMessagesQuery,
 } = chatApi;
