"use client";

import baseApi from "../Api/baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/signup/",
        method: "POST",
        body: data,
      }),
    }),

    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => {
        return {
          url: "/auth/reset-password",
          method: "POST",
          body: data,
          headers: {
          Authorization: `Bearer ${localStorage.getItem("verificationToken")}`,
        },
        };
      },
    }),

    googleLogin: builder.mutation({
      query: ({id_token}) => ({
        url: "/auth/googleLogin/",
        method: "POST",
        body: {id_token: id_token},
      }),
    }),

    // facebookLogin: builder.mutation({
    //   query: ({ access_token }) => ({
    //     url: "/auth/facebookLogin/",
    //     method: "POST",
    //     headers: {
    //       Authorization: `${access_token}`,
    //     },
    //   }),
    // }),
    facebookLogin: builder.mutation({
      query: ({ access_token }) => ({
        url: "/auth/facebookLogin/",
        method: "POST",
        body: {
          access_token: access_token,
        },
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useGoogleLoginMutation,
  useFacebookLoginMutation,
} = authApi;
