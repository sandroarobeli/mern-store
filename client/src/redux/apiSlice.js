import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_DOMAIN}/api`,
  }),
  tagTypes: ["Product"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    credentialLogin: builder.mutation({
      query: ({ email, password }) => ({
        url: "/users/login",
        method: "POST",
        // body: initialUserCredentials, same as object below..
        body: {
          email: email,
          password: password,
        },
      }),
    }),
    googleLogin: builder.mutation({
      query: (initialGoogleCredential) => ({
        url: "/users/google-login",
        method: "POST",
        // Include the entire googleResponse.credential object as the body of the request
        body: initialGoogleCredential,
      }),
    }),
    credentialRegister: builder.mutation({
      query: ({ name, email, password }) => ({
        url: "/users/register",
        method: "POST",
        body: {
          name: name,
          email: email,
          password: password,
        },
      }),
    }),
    googleRegister: builder.mutation({
      query: (initialGoogleCredential) => ({
        url: "/users/google-register",
        method: "POST",
        body: initialGoogleCredential,
      }),
    }),
    passwordResetEmail: builder.mutation({
      query: ({ email }) => ({
        url: "/users/reset-email",
        method: "POST",
        body: {
          email: email,
        },
      }),
    }),
    updatePassword: builder.mutation({
      query: ({ email, password }) => ({
        url: "/users/update-password",
        method: "PATCH",
        body: {
          email: email,
          password: password,
        },
      }),
    }),
    placeOrder: builder.mutation({
      query: (initialOrder) => ({
        url: "/orders/place-order",
        method: "POST",
        headers: {
          Authorization: "Bearer " + initialOrder.token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: initialOrder,
      }),
      // Disabling this, so it does not invalidate /product/:id rout
      // invalidatesTags: ["Product"],
    }),
    getOrderById: builder.query({
      // REMEMBER: IF I NEED MORE THAN ONE ARGUMENT IN THE QUERY BELOW,
      // I MUST INPUT IT AS AN OBJECT!!!
      query: ({ id, token }) => ({
        url: `/orders/${id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
    }),
  }),
});
// For user profile lookup and that user's orders list lookup ==> use this
// const getUser = await prisma.user.findUnique({
//   where: {
//     id: userId,
//   },
//   include: {
//     orders: true,
//   },
// });

export const {
  useGetProductsQuery,
  useGoogleLoginMutation,
  useCredentialLoginMutation,
  useGoogleRegisterMutation,
  useCredentialRegisterMutation,
  usePasswordResetEmailMutation,
  useUpdatePasswordMutation,
  usePlaceOrderMutation,
  useGetOrderByIdQuery,
} = apiSlice;
