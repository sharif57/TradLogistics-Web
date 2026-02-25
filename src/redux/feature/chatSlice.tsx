
import baseApi from "../Api/baseApi";

export const chatApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    createConversation: builder.mutation({
      query: (data) => ({
        url: `/chat/conversations/`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Chat"],
    }),

    getInbox: builder.query({
      query: () => ({
        url: `/chat/conversations/`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),
    getMessages: builder.query({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/messages/`,
        method: "GET",
      }),
      providesTags: ["Chat"],
    }),

    // /chat/conversations/9c5f0252-d524-40b2-80dc-23e18c033d30/read/
    markAsRead: builder.mutation({
      query: (conversationId) => ({
        url: `/chat/conversations/${conversationId}/read/`,
        method: "POST",
      }),
      invalidatesTags: ["Chat"],
    })
  }),
});

export const {
  useCreateConversationMutation,
  useGetInboxQuery,
  useGetMessagesQuery,
  useMarkAsReadMutation,
} = chatApi;
