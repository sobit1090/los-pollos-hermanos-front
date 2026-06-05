import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { ProtectedRoute } from "protected-route-react";

// Redux
import { loadUser } from "../redux/actions/user";

// Layout
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

// Pages & Components
import Home from "../components/home/Home";
import AuthContainer from "../components/Auth/AuthContainer";
import ComplaintContactContainer from "../components/contact/ComplaintContactContainer";
import Cart from "../components/cart/FoodCart";
import Shipping from "../components/cart/Shipping";
import Services from "../components/cart/Services";
import ConfirmOrder from "../components/cart/ConfirmOrder";
import PaymentSuccess from "../components/cart/PaymentSuccess";
import MyOrders from "../components/myOrders/MyOrders";
import OrderDetails from "../components/myOrders/OrderDetails";
import Dashboard from "../components/admin/Dashboard";
import Orders from "../components/admin/Orders";
import Users from "../components/admin/Users";
import UserDetail from "../components/admin/UserDetail";
import About from "../components/home/About";
import MenuNew from "../components/home/Menu_new";
import LoadingSpinner from "../components/layout/LoadingSpinner";
import ProfileWrapper from ".././components/profile/ProfileWrapper";

// Styles
import "../styles/app.scss";
import "../styles/header.scss";
import "../styles/loading.scss";
import "../styles/users.scss";
import "../styles/footer.scss";
import "../styles/cart.scss";
import "../styles/orderDetails.scss";
import "../styles/profile.scss";
import "../styles/home.scss";
import "../styles/founder.scss";
import "../styles/menu.scss";
import "../styles/table.scss";
import "../styles/confirmOrder.scss";
import "../styles/paymentSuccess.scss";
import "../styles/shipping.scss";
import "../styles/footerDescription.scss";
import "../styles/ContactUs.scss";
import "../styles/services.scss";
import "../styles/dashboard.scss";
import "../styles/user.scss";
import "../styles/orders.scss";
import "../styles/about.scss";
import "../styles/menu_new.scss";
import "./App.css";
import "./index.css";

function App() {
  const { cartItems = [] } = useSelector((state) => state.cart || {});
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const dispatch = useDispatch();
  const { error, isAuthenticated, message, loading, user } = useSelector(
    (state) => state.auth
  );
  const [appLoading, setAppLoading] = useState(true);

  // Load user once on app start
  useEffect(() => {
    const initializeApp = async () => {
      const timeout = new Promise((resolve) => setTimeout(resolve, 8000));
      const userRequest = dispatch(loadUser());

      try {
        await Promise.race([userRequest, timeout]);
      } catch (error) {
        console.error("loadUser failed:", error);
      } finally {
        setAppLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  // Handle global toast notifications
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [dispatch, error, message]);

  if (appLoading) {
    return <LoadingSpinner message="Preparing your experience..." />;
  }

  const isAdmin = user?.role === "admin";

  return (
    <div className="sobit">
      <Router>
        <Header isAuthenticated={isAuthenticated} cartItemsCount={totalItems} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/contacts" element={<ComplaintContactContainer />} />
          <Route path="/about" element={<About />} />
          <Route path="/NewMenu" element={<MenuNew />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/service" element={<Services />} />

          {/* Auth Route - redirect if already authenticated */}
          <Route
            path="/login"
            element={
              <ProtectedRoute isAuthenticated={!isAuthenticated} redirect="/">
                <AuthContainer />
              </ProtectedRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/login">
                <ProfileWrapper />
              </ProtectedRoute>
            }
          />
          <Route
            path="/myorders"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/login">
                <MyOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/login">
                <OrderDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipping"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/login">
                <Shipping />
              </ProtectedRoute>
            }
          />
          <Route
            path="/confirmOrder"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/login">
                <ConfirmOrder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/CashOnDelivery"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated} redirect="/login">
                <PaymentSuccess />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={isAdmin}
                redirectAdmin="/"
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={isAdmin}
                redirectAdmin="/"
              >
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={isAdmin}
                redirectAdmin="/"
              >
                <Users />
              </ProtectedRoute>
            }
          />
          {/* ✅ Fixed: was /admin/user/:id — now /admin/users/:id to match Users.jsx navigation */}
          <Route
            path="/admin/users/:id"
            element={
              <ProtectedRoute
                isAuthenticated={isAuthenticated}
                adminRoute={true}
                isAdmin={isAdmin}
                redirectAdmin="/"
              >
                <UserDetail />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer isAuthenticated={isAuthenticated} />
        <Toaster position="bottom-center" />
      </Router>
    </div>
  );
}

export default App;
