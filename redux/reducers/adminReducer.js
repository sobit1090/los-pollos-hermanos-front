import { createReducer } from "@reduxjs/toolkit";

const initialState = { orders: [], users: [], stats: null };

export const adminReducer = createReducer(initialState, (builder) => {
  builder
    // ── Dashboard Stats ────────────────────────────────────
    .addCase("getDashboardStatsRequest", (state) => {
      state.loading = true;
    })
    .addCase("getDashboardStatsSuccess", (state, action) => {
      state.loading       = false;
      state.usersCount    = action.payload.usersCount;
      state.ordersCount   = action.payload.ordersCount;
      state.totalIncome   = action.payload.totalIncome;
      // Store extra stats for charts (ordersByStatus, monthlyRevenue)
      state.stats         = action.payload.stats || null;
    })
    .addCase("getDashboardStatsFail", (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })

    // ── Admin Users List ───────────────────────────────────
    .addCase("getAdminUsersRequest", (state) => {
      state.loading = true;
    })
    .addCase("getAdminUsersSuccess", (state, action) => {
      state.loading = false;
      state.users   = action.payload;
    })
    .addCase("getAdminUsersFail", (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })

    // ── Toggle User Status (Active / Suspended) ────────────
    .addCase("toggleUserStatusRequest", (state) => {
      state.loading = true;
    })
    .addCase("toggleUserStatusSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase("toggleUserStatusFail", (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })

    // ── Delete User ────────────────────────────────────────
    .addCase("deleteUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("deleteUserSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase("deleteUserFail", (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })

    // ── Admin Orders ───────────────────────────────────────
    .addCase("getAdminOrdersRequest", (state) => {
      state.loading = true;
    })
    .addCase("getAdminOrdersSuccess", (state, action) => {
      state.loading = false;
      state.orders  = action.payload;
    })
    .addCase("getAdminOrdersFail", (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })

    // ── Process / Advance Order Status ─────────────────────
    .addCase("processOrderRequest", (state) => {
      state.loading = true;
    })
    .addCase("processOrderSuccess", (state, action) => {
      state.loading = false;
      state.message = action.payload;
    })
    .addCase("processOrderFail", (state, action) => {
      state.loading = false;
      state.error   = action.payload;
    })

    // ── Utility ────────────────────────────────────────────
    .addCase("clearError", (state) => {
      state.error = null;
    })
    .addCase("clearMessage", (state) => {
      state.message = null;
    });
});
