"use client";

import { read } from "fs";
import baseApi from "../Api/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    userProfile: builder.query({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),

      providesTags: ["User"],
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update-profile",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    allUsers: builder.query({
      query: ({ page, limit, search }) => ({
        // /user/all-user?page=1&limit=10
        url: `/user/all-user?page=${page}&limit=${limit}&search=${search}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    allUserSearch: builder.query({
      query: ({searchTerm}) => ({
        // /user/search-user?search=abc
        url: `/user/user-search?searchTerm=${searchTerm}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation({
      query: (id) => ({
        // /user/delete-by-admin/68da55be593e867bdf3ade8b
        url: `/user/delete-by-admin/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // /notification/admin-notifications
    allNotifications: builder.query({
      query: ({ page, limit }) => ({
        url: `/notification/admin-notifications?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    deleteNotification: builder.mutation({
      query: (id) => ({
        // /notification/delete-by-admin/68da55be593e867bdf3ade8b
        url: `/notification/admin-notification/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    readNotification: builder.query({
      query: (id) => ({
        // /notification/admin-notification/68da55be593e867bdf3ade8b
        url: `/notification/admin-notification/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    sendEmail: builder.mutation({
      query: (data) => ({
        url: "/notification/admin-notification/send-inbox-message",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const { useUserProfileQuery, useUpdateProfileMutation, useAllUsersQuery, useDeleteUserMutation, useAllNotificationsQuery, useDeleteNotificationMutation, useReadNotificationQuery , useAllUserSearchQuery , useSendEmailMutation } = userApi;
