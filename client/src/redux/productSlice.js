import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearProductError: (state, action) => {
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {},
});

// Exports reducer functions
export const { clearProductError } = productSlice.actions;

// Exports individual selectors
export const selectAllProducts = (state) => state.product.products;
export const selectProductBySlug = (state, slug) =>
  state.product.products.find((item) => item.slug === slug);

export default productSlice.reducer;
