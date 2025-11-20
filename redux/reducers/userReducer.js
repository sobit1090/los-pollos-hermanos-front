import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder
    // Load user
    .addCase("loadUserRequest", (state) => {
      state.loading = true;
    })
    .addCase("loadUserSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated =false;
      state.user = action.payload;
    })
    .addCase("loadUserFail", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.error = action.payload;
    })

    // ✅ Update profile photo (added now)
    .addCase("updateProfilePhoto", (state, action) => {
      if (state.user) {
        state.user.photo = action.payload; // update photo instantly
      }
    })

    // Logout
    .addCase("logoutRequest", (state) => {
      state.loading = true;
    })
    .addCase("logoutSuccess", (state, action) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.message = action.payload;
    })
    .addCase("logoutFail", (state, action) => {
      state.loading = false;
      state.error = action.payload;
    })

    // Clear errors & messages
    .addCase("clearError", (state) => {
      state.error = null;
    })
    .addCase("clearMessage", (state) => {
      state.message = null;
    });
});
