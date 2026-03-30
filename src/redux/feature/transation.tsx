
import baseApi from "../Api/baseApi";

export const transationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    paymentList: builder.query({
      query: () => ({
        url: `/transaction/company/payment-history/`,                                                               
        method: "GET",
      }),
      providesTags: ["Transaction"],
    }),
  
  }),
});

export const {
  usePaymentListQuery,
} = transationApi;
