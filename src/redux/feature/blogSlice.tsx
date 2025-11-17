"use client";

import baseApi from "../Api/baseApi";

export const blogsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    blogsGet: builder.query({
      query: () => ({
        url: "/blogs/v1/ms-posts/",
        method: "GET",
      }),
      providesTags: ["Blog"],
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
    blogsDetails: builder.query({
      query: (id) => ({
        url: `/blogs/v1/ms-posts/${id}/`,
        method: "GET",
        // headers: {
        //   Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        // },
      }),
      providesTags: ["Blog"],
    }),
  }),
});

export const { useBlogsGetQuery, useStoryCreateMutation ,useBlogsDetailsQuery } = blogsApi;
