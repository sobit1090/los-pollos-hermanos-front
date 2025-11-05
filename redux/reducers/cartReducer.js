import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  cartItems: [], // each item has id, name, price, quantity
  subTotal: 0,
  tax: 0,
  shippingCharges: 0,
  total: 0,
  shippingInfo: {},
  serviceType:"",
};

export const cartReducer = createReducer(initialState, (builder) => {
  builder
    // ✅ Add or increment item
    .addCase("addToCart", (state, action) => {
      const item = action.payload;
      const existing = state.cartItems.find((i) => i.id === item.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...item, quantity: 1 });
      }
    })
 .addCase("setServiceType", (state, action) => {
      state.serviceType = action.payload;
    })
    // ✅ Remove item entirely
    .addCase("removeFromCart", (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
    })

    // ✅ Decrement item quantity
    .addCase("decrementItem", (state, action) => {
      const existing = state.cartItems.find((i) => i.id === action.payload);
      if (existing) {
        existing.quantity -= 1;
        if (existing.quantity <= 0) {
          state.cartItems = state.cartItems.filter((i) => i.id !== action.payload);
        }
      }
    })

    // ✅ Recalculate all totals
    .addCase("calculatePrice", (state) => {
      state.subTotal = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      state.tax = +(state.subTotal * 0.18).toFixed(2);
      state.shippingCharges = state.subTotal > 1000 ? 0 : 200;
      state.total = +(state.subTotal + state.tax + state.shippingCharges).toFixed(2);
    })

    // ✅ Empty cart
    .addCase("emptyState", (state) => {
      state.cartItems = [];
      state.subTotal = 0;
      state.tax = 0;
      state.shippingCharges = 0;
      state.total = 0;
    })

    // ✅ Add shipping info
    .addCase("addShippingInfo", (state, action) => {
      state.shippingInfo = action.payload;
    });
});

    import { createAction } from "@reduxjs/toolkit";
export const setServiceType = createAction("setServiceType");