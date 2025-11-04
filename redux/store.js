import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./reducers/cartReducer";
import { authReducer } from "./reducers/userReducer";
import { orderReducer, ordersReducer } from "./reducers/orderReducer";
import { adminReducer } from "./reducers/adminReducer";

// ✅ Helper to safely load cart from localStorage
function loadCartFromStorage() {
  try {
    const data = localStorage.getItem("cart");
    if (!data) return undefined;

    const parsed = JSON.parse(data);
    // 🧱 Ensure structure matches reducer
    return {
      cartItems: parsed.cartItems || [],
      subTotal: parsed.subTotal || 0,
      tax: parsed.tax || 0,
      shippingCharges: parsed.shippingCharges || 0,
      total: parsed.total || 0,
    };
  } catch (e) {
    console.error("Error loading cart from storage:", e);
    return undefined;
  }
}

// ✅ Preload the cart before store creation
const preloadedState = {
  cart: loadCartFromStorage(),
};

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    orders: ordersReducer,
    admin: adminReducer,
  },
  preloadedState,
});

// ✅ Save whenever cart changes
store.subscribe(() => {
  try {
    const state = store.getState();
    localStorage.setItem("cart", JSON.stringify(state.cart));
  } catch (e) {
    console.error("Error saving cart:", e);
  }
});

export default store;

export const server = "https://los-pollos-hermanos-0ui5.onrender.com/api/v1";
