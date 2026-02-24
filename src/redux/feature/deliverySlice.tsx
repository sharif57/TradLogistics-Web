
import baseApi from "../Api/baseApi";

export const deliveryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        //    /order/deliveries/
        createDelivery: builder.mutation({
            query: (data) => ({
                url: "/order/deliveries/",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Delivery"],
        }),

        // /order/deliveries/1/
        getDelivery: builder.query({
            query: (id) => ({
                url: `/order/deliveries/${id}`,
                method: "GET",
            }),
            providesTags: ["Delivery"],
        }),

        // /order/deliveries/10/search-driver/
        searchDriverAndAssign: builder.mutation({
            query: ({ deliveryId, data }) => ({
                url: `/order/deliveries/${deliveryId}/search-driver/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Delivery"],
        }),

        // /order/deliveries/<id>/cancel/</id>
        cancelDelivery: builder.mutation({
            query: (id) => ({
                url: `/order/deliveries/${id}/cancel/`,
                method: "POST",
            }),
            invalidatesTags: ["Delivery"],
        }),

        // /order/deliveries/
        getDeliveries: builder.query({
            query: () => ({
                url: "/order/deliveries/",
                method: "GET",
            }),
            providesTags: ["Delivery"],
        }),
        // /order/deliveries/10/
        getDeliveryById: builder.query({
            query: (id) => ({
                url: `/order/deliveries/${id}/`,
                method: "GET",
            }),
            providesTags: ["Delivery"],
        }),

        // /order/deliveries/2/rate/
        rateDelivery: builder.mutation({
            query: ({ deliveryId, data }) => ({
                url: `/order/deliveries/${deliveryId}/rate/`,
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Delivery"],
        }),

    }),
});

export const { useCreateDeliveryMutation, useGetDeliveryQuery, useSearchDriverAndAssignMutation, useCancelDeliveryMutation, useGetDeliveriesQuery, useGetDeliveryByIdQuery, useRateDeliveryMutation } = deliveryApi;
