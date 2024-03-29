import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Define our single API slice object
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.REACT_APP_SERVER_DOMAIN}/api`,
  }),
  tagTypes: ["Product", "Order", "Summary", "User", "Comment"],
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getSearchResults: builder.mutation({
      query: ({
        query,
        category,
        brand,
        price,
        rating,
        sort,
        page,
        limit,
      }) => ({
        url: "/products/search",
        method: "POST",
        body: {
          query: query,
          category: category,
          brand: brand,
          price: price,
          rating: rating,
          sort: sort,
          page: page,
          limit: limit,
        },
      }),
    }),
    getFilters: builder.query({
      query: () => "/products/filter",
    }),
    getComments: builder.query({
      query: (id) => `/products/${id}/comments`,
      providesTags: ["Comment"],
    }),
    postComments: builder.mutation({
      query: ({ id, token, content, rating }) => ({
        url: `/products/${id}/comments`,
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          content: content,
          rating: rating,
        },
      }),
      invalidatesTags: ["Comment", "Product"],
    }),
    updateProduct: builder.mutation({
      query: ({
        id,
        token,
        name,
        slug,
        price,
        image,
        category,
        brand,
        inStock,
        description,
      }) => ({
        url: `/admin/product/${id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          name: name,
          slug: slug,
          price: price,
          image: image,
          category: category,
          brand: brand,
          inStock: inStock,
          description: description,
        },
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: ({ id, token }) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {},
      }),
      invalidatesTags: ["Product"],
    }),
    deleteUser: builder.mutation({
      query: ({ id, token }) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {},
      }),
      invalidatesTags: ["User"],
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
      invalidatesTags: ["Summary", "User"],
    }),
    googleRegister: builder.mutation({
      query: (initialGoogleCredential) => ({
        url: "/users/google-register",
        method: "POST",
        body: initialGoogleCredential,
      }),
      invalidatesTags: ["Summary", "User"],
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
    getUsers: builder.query({
      query: (token) => ({
        url: "/admin/users",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
        mode: "cors",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation({
      query: ({ id, token, isAdmin }) => ({
        url: `/admin/user/${id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          isAdmin: isAdmin,
        },
      }),
      invalidatesTags: ["User"],
    }),
    updateProfile: builder.mutation({
      query: ({ name, email, password, token }) => ({
        url: "/users/update-profile",
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          name: name,
          email: email,
          password: password,
        },
      }),
    }),
    deleteAccount: builder.mutation({
      query: ({ userId, email, token }) => ({
        url: `/users/${userId}/delete`,
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          email: email,
        },
      }),
      invalidatesTags: ["Summary", "User"],
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
      invalidatesTags: ["Summary"],
    }),
    getOrderById: builder.query({
      query: ({ id, token }) => ({
        url: `/orders/${id}`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
      providesTags: ["Order"],
    }),
    getOrderHistory: builder.query({
      query: ({ token, userId }) => ({
        url: `/orders/${userId}/history`,
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }),
    }),
    updatePaidStatus: builder.mutation({
      query: ({ id, token, orderDetails }) => ({
        url: `/orders/${id}/pay`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: orderDetails,
      }),
      invalidatesTags: ["Order", "Summary"],
    }),
    getAdminSummary: builder.query({
      query: (token) => ({
        url: "/admin/summary",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
        mode: "cors",
      }),
      providesTags: ["Summary"],
    }),
    getAdminOrders: builder.query({
      query: (token) => ({
        url: "/admin/orders",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
        mode: "cors",
      }),
      providesTags: ["Order"],
    }),
    updateDeliveredStatus: builder.mutation({
      query: ({ id, token }) => ({
        url: `/admin/order/${id}`,
        method: "PATCH",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {},
      }),
      invalidatesTags: ["Order", "Summary"],
    }),
    getSignature: builder.query({
      query: (token) => ({
        url: "/admin/cloudinary-sign",
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
        mode: "cors",
      }),
    }),
    uploadImage: builder.mutation({
      query: (formData) => ({
        url: `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`,
        method: "POST",
        mode: "cors",
        body: formData,
      }),
    }),
    createProduct: builder.mutation({
      query: ({
        token,
        name,
        slug,
        category,
        image,
        price,
        brand,
        inStock,
        description,
      }) => ({
        url: "/admin/product",
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        mode: "cors",
        body: {
          name: name,
          slug: slug,
          category: category,
          image: image,
          price: price,
          brand: brand,
          inStock: inStock,
          description: description,
        },
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetSearchResultsMutation,
  useGetFiltersQuery,
  useGetCommentsQuery,
  usePostCommentsMutation,
  useUpdateProductMutation,
  useGoogleLoginMutation,
  useCredentialLoginMutation,
  useGoogleRegisterMutation,
  useCredentialRegisterMutation,
  usePasswordResetEmailMutation,
  useUpdatePasswordMutation,
  useUpdateProfileMutation,
  useGetUsersQuery,
  useDeleteAccountMutation,
  usePlaceOrderMutation,
  useGetOrderByIdQuery,
  useGetOrderHistoryQuery,
  useUpdatePaidStatusMutation,
  useUpdateDeliveredStatusMutation,
  useGetAdminSummaryQuery,
  useGetAdminOrdersQuery,
  useGetSignatureQuery,
  useUploadImageMutation,
  useCreateProductMutation,
  useDeleteProductMutation,
  useDeleteUserMutation,
  useUpdateUserMutation,
} = apiSlice;
