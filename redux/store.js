// store.js
import { configureStore } from "@reduxjs/toolkit";
import { cartReducer } from "./reducers/cartReducer";
import { authReducer } from "./reducers/userReducer";
import { orderReducer, ordersReducer } from "./reducers/orderReducer";
import { adminReducer } from "./reducers/adminReducer";

const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    orders: ordersReducer,
    admin: adminReducer,
  },
});

export default store;

export const server="https://los-pollos-hermanos-0ui5.onrender.com/api/v1"