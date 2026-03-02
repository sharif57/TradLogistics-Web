import baseApi from "@/redux/Api/baseApi";


export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTruck: builder.mutation({
      query: (data) => ({
        url: "/company/trucks/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),

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

export const { useCreateTruckMutation, useCompanyListQuery, useCompanyTrucksQuery, useAllDriverListQuery } = userApi;
