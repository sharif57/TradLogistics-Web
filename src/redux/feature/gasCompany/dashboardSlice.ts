import baseApi from "@/redux/Api/baseApi";


export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // /company/dashboard/
    dashboard: builder.query({
        query: () => ({
            url: "/company/dashboard/",
            method: "GET",
        }),
        providesTags: ["Dashboard"],
    })
  }),
});

export const {
    useDashboardQuery,
} = dashboardApi;
