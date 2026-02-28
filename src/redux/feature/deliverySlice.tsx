
import baseApi from "../Api/baseApi";

type DeliveryOverviewItem = {
    month: number;
    label: string;
    value: number;
    count: number;
    amount: number;
};

type ClientDashboardData = {
    total_deliveries: number;
    total_pending: number;
    total_searching: number;
    total_driver_assigned: number;
    total_picked_up: number;
    total_in_transit: number;
    total_delivered: number;
    total_cancelled: number;
    total_spend: number;
    delivery_overview: {
        year: number;
        data: DeliveryOverviewItem[];
    };
};

type ClientDashboardResponse = {
    status: string;
    data: ClientDashboardData;
};

type ClientDashboardParams = {
    year?: number;
};

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

        // /order/client/dashboard/
        getClientDashboard: builder.query<ClientDashboardResponse, ClientDashboardParams | void>({
            query: (params) => {
                if (params) {
                    return {
                        url: `/order/company/dashboard/`,
                        method: "GET",
                        params,
                    };
                }

                return {
                    url: `/order/company/dashboard/`,
                    method: "GET",
                };
            },
            providesTags: ["Delivery"],
        }),

    }),
});

export const { useCreateDeliveryMutation, useGetDeliveryQuery, useSearchDriverAndAssignMutation, useCancelDeliveryMutation, useGetDeliveriesQuery, useGetDeliveryByIdQuery, useRateDeliveryMutation, useGetClientDashboardQuery } = deliveryApi;
