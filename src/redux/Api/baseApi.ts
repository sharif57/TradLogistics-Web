import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.10.12.111:8001/api",
    // baseUrl: "https://enitiative.org/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      console.log("token", token);

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
    'Setting'

  ],
  endpoints: () => ({}),
});

export default baseApi;
