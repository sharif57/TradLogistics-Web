import baseApi from "@/redux/Api/baseApi";


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    companyList: builder.query({
      query: () => ({
        url: "/company/trucks/",
        method: "GET",
      }),
        providesTags: ["Company"],
    }),
    // /company/trucks/
    companyTrucks: builder.query({
      query: () => ({
        url: "/company/trucks/",
        method: "GET",
      }),
      providesTags: ["Company"],
    }),

    // /accounts/users/?role
    allDriverList: builder.query({
      query: (role) => ({
        url: `/accounts/users/?role=${role}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),


  }),
});

export const { useCompanyListQuery, useCompanyTrucksQuery , useAllDriverListQuery } = userApi;
