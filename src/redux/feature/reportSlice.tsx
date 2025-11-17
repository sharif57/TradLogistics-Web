"use client";

import baseApi from "../Api/baseApi";

export const reportApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
   

    allReports: builder.query({
      query: ({page, limit}) => ({
        // /report/all-report?page=1&limit=10
        url: `/report/all-report?page=${page}&limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    singleReport: builder.query({
      query: (id) => ({
        // /report/68dbad05b1f887ee5acf9da0
        url: `/report/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    deleteReport: builder.mutation({
      query: (id) => ({
        // //report/68dbad05b1f887ee5acf9da0
        url: `/report/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const { useAllReportsQuery, useDeleteReportMutation , useSingleReportQuery} = reportApi;
