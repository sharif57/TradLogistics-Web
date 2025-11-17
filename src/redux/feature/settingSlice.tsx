import baseApi from "../Api/baseApi";


const settingSlice = baseApi.injectEndpoints({
  endpoints: (builder) => ({


    getTermsAndConditions: builder.query({
      query: () => ({
        url: `/terms`,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),
    editTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: `/terms/update-terms-condition`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),


    getPrivacyPolicy: builder.query({
      query: () => ({
        url: `/privacy`,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),
    updatePrivacyPolice: builder.mutation({
      query: (data) => ({
        url: `/privacy/update-privacy`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),



    getAbout: builder.query({
      query: () => ({
        url: `/about`,
        method: "GET",
      }),
      providesTags: ["Setting"],
    }),

    updateAbout: builder.mutation({
      query: (data) => ({
        url: `/about/update-about`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Setting"],
    }),

  }),
});

export const {
  useGetTermsAndConditionsQuery,
  useEditTermsAndConditionsMutation,
  useGetPrivacyPolicyQuery,
  useUpdatePrivacyPoliceMutation,
  useGetAboutQuery,
  useUpdateAboutMutation
} = settingSlice;
