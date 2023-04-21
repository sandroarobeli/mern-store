import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    // Storing the current data locally in the local storage, so page reload doesn't affect it
    // local storage can only save json, so if cart object exists, parse it
    cart: localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : { cartItems: [], shippingAddress: {}, paymentMethod: "" },
    status: "idle",
    error: null,
  },
  reducers: {
    // Sets state.status to 'idle' again so login button becomes clickable again
    clearCartError: (state, action) => {
      state.error = null;
      state.status = "idle";
    },
    cartAddItem: (state, action) => {
      const newItem = action.payload;

      // Determine if the item is already present in the cart
      const existingItem = state.cart.cartItems.find(
        (item) => item.slug === newItem.slug
      );

      // If not, we just add it to the cart. Otherwise, we go through the list of
      // Selected items and replace its kind with the newly updated(because newItem has
      // Updated quantity) item
      state.cart.cartItems = existingItem
        ? state.cart.cartItems.map((item) =>
            item.name === existingItem.name ? newItem : item
          )
        : state.cart.cartItems.concat(newItem);

      // We store cart with added items in local storage as string
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    cartRemoveItem: (state, action) => {
      const { slug } = action.payload;
      state.cart.cartItems = state.cart.cartItems.filter(
        (item) => item.slug !== slug
      );
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCartItems: (state) => {
      state.cart.cartItems = [];
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    cartReset: (state) => {
      state.cart = { cartItems: [], shippingAddress: {}, paymentMethod: "" };
      localStorage.removeItem("cart");
    },
    saveShippingAddress: (state, action) => {
      state.cart.shippingAddress = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    savePaymentMethod: (state, action) => {
      state.cart.paymentMethod = action.payload;
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
  },
  extraReducers: (builder) => {},
});

// Exports reducer functions
export const {
  clearCartError,
  cartAddItem,
  cartRemoveItem,
  clearCartItems,
  cartReset,
  saveShippingAddress,
  savePaymentMethod,
} = cartSlice.actions;

// Exports individual selectors
export const selectAllItems = (state) => state.cart.cart.cartItems;
export const selectItemBySlug = (state, slug) =>
  state.cart.cart.cartItems.find((item) => item.slug === slug);
export const selectShippingAddress = (state) => state.cart.cart.shippingAddress;
export const selectPaymentMethod = (state) => state.cart.cart.paymentMethod;

export default cartSlice.reducer;
