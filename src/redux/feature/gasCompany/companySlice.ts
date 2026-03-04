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
    // /order/deliveries/
    createDeliveryOrder: builder.mutation({
      query: (data) => ({
        url: "/order/deliveries/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Delivery"],
    }),

    getDeliveryOrders: builder.query({
      query: () => ({
        url: "/order/deliveries/",
        method: "GET",
      }),
      providesTags: ["Delivery"],
    }),


  }),
});

export const { useCreateTruckMutation, useCompanyListQuery, useCompanyTrucksQuery, useAllDriverListQuery, useCreateDeliveryOrderMutation, useGetDeliveryOrdersQuery } = userApi;
