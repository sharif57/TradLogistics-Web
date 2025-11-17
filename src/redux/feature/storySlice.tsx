"use client";

import baseApi from "../Api/baseApi";

export const storyApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    storyGet: builder.query({
      query: () => ({
        url: "/blogs/v1/blogs/",
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        // },
      }),

      providesTags: ["Story"],
    }),

    storyCreate: builder.mutation({
      query: (data) => ({
        url: "/blogs/v1/blogs/",
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      invalidatesTags: ["Story"],
    }),
    storyDetails: builder.query({
      query: (id) => ({
        url: `/blogs/v1/blogs/${id}/`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }),
      providesTags: ["Story"],
    }),
  }),
});

export const { useStoryGetQuery, useStoryCreateMutation ,useStoryDetailsQuery } = storyApi;
