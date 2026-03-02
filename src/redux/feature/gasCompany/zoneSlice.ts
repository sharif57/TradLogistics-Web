import baseApi from "@/redux/Api/baseApi";


export const zoneApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createZone: builder.mutation({
      query: (data) => ({
        url: "/company/zones/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Zone"],
    }),
    allZoneList: builder.query({
      query: () => ({
        url: "/company/zones/",
        method: "GET",
      }),
      providesTags: ["Zone"],
    }),
    updateZone: builder.mutation({
      query: ({id, data}) => ({
        url: `/company/zones/${id}/`, 
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Zone"],
    }),
    deleteZone: builder.mutation({
      query: (id) => ({
        url: `/company/zones/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Zone"],
    }),

  }),
});

export const { useCreateZoneMutation, useAllZoneListQuery, useUpdateZoneMutation, useDeleteZoneMutation } = zoneApi;
