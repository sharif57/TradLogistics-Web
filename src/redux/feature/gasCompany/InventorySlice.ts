import baseApi from "@/redux/Api/baseApi";


export const inventoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // /company/trucks/1f7fe9de-842f-4eeb-8660-1a4749a96b16/inventory/
    updateInventory: builder.mutation({
      query: ({ truckId, data }) => ({
        url: `/company/trucks/${truckId}/inventory/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const { 
  useUpdateInventoryMutation,
 } = inventoryApi;
