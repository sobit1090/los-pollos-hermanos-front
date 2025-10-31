import { createReducer } from "@reduxjs/toolkit";

// --- Single Order Reducer ---
export const orderReducer = createReducer({}, (builder) => {
  builder
    .addCase("createOrderRequest", (state) => {
      state.loading = true;
    })
    .addCase("createOrderSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase("createOrderFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("paymentVerificationRequest", (state) => {
      state.loading = true;
    })
    .addCase("paymentVerificationSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase("paymentVerificationFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("clearMessage", (state) => {
      state.message = null;
    })
    .addCase("clearError", (state) => {
      state.error = null;
    });
});

// --- Orders List Reducer ---
export const ordersReducer = createReducer({ orders: [] }, (builder) => {
  builder
    .addCase("getMyOrdersRequest", (state) => {
      state.loading = true;
    })
    .addCase("getMyOrdersSuccess", (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    })
    .addCase("getMyOrdersFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("getOrderDetailsRequest", (state) => {
      state.loading = true;
    })
    .addCase("getOrderDetailsSuccess", (state, action) => {
      state.loading = false;
      state.order = action.payload;
    })
    .addCase("getOrderDetailsFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })
    .addCase("clearError", (state) => {
      state.error = null;
    })
    .addCase("clearMessage", (state) => {
      state.message = null;
    });
});
