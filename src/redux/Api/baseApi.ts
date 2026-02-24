/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    // baseUrl: "https://enitiative.org/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      // console.log("token", token);

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: [
    "User",
    "Session",
    "Story",
    "Blog",
    'Setting',
      'Delivery'

  ],
  endpoints: () => ({}),
});

export default baseApi;

// "use client";
 
// import {
//   BaseQueryFn,
//   createApi,
//   FetchArgs,
//   fetchBaseQuery,
//   FetchBaseQueryError,
// } from "@reduxjs/toolkit/query/react";
// import { toast } from "sonner";
 
// const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_API_URL,
//   credentials: "include",
//   prepareHeaders: (headers) => {
//     console.log("Preparing headers for API request", window?.location?.href);
 
//     if (typeof window !== "undefined") {
//       const token = localStorage?.getItem("accessToken");
//       if (token) {
//         headers.set("authorization", `Bearer ${token}`);
//       }
//     }
//     return headers;
//   },
// });
 
// let isLoggingOut = false;
 
// const customBaseQuery: BaseQueryFn<
//   FetchArgs | string,
//   unknown,
//   FetchBaseQueryError
// > = async (args, api, extraOptions): Promise<any> => {
//   const result = await baseQuery(args, api, extraOptions);
 
//   if (typeof window === "undefined") {
//     return result;
//   }
 
//   const pathname = window?.location?.pathname || "";
 
//   if (result.error && result.error.status === 401) {
//     if (!isLoggingOut && pathname !== "/auth/login") {
//       isLoggingOut = true;
//       localStorage?.removeItem("accessToken"); // Clear invalid token
 
//       toast.error("Session expired. Please login again.");
 
//       if (window?.location?.replace) {
//         setTimeout(() => {
//           window.location.replace("/auth/login");
//         }, 400);
//       }
//     }
//   } else if (result.error && result.error.status === 403) {
//     alert("You need to verify your email to use this feature.");
//     if (window?.location?.href) window.location.href = "/";
//   } 
//   return result;
// };
 
// export const baseApi = createApi({
//   reducerPath: "api",
//   baseQuery: customBaseQuery,
//   tagTypes: [   
//     "User",
//     "Session",
//     "Story",
//     "Blog",
//     'Delivery',
//     'Setting'],
//   endpoints: () => ({}),
// });
 
// export default baseApi;
 
// export type TList = {
//   page?: number;
//   limit?: number;
//   search?: string;
// };