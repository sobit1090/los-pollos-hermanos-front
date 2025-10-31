import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";

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
import Profile from "../components/profile/Profile";
import MyOrders from "../components/myOrders/MyOrders";
import OrderDetails from "../components/myOrders/OrderDetails";
import Dashboard from "../components/admin/Dashboard";
import Orders from "../components/admin/Orders";
import Users from "../components/admin/Users";
import About from "../components/home/About";
import MenuNew from "../components/home/Menu_new";

// Styles
import "../styles/app.scss";
import "../styles/header.scss";
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
  const dispatch = useDispatch();
  const { error,isAuthenticated, message } = useSelector((state) => state.auth);

  // Load user once on app start
  useEffect(() => {
    dispatch(loadUser());
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

  return (
    <div className="sobit">
      <Router>
        <Header isAuthenticated={isAuthenticated}  />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<AuthContainer />} />
          <Route path="/contacts" element={<ComplaintContactContainer />} />
          <Route path="/about" element={<About />} />
          <Route path="/NewMenu" element={<MenuNew />} />

          {/* Cart & Order Routes */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/service" element={<Services />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/confirmOrder" element={<ConfirmOrder />} />
          <Route path="/CashOnDelivery" element={<PaymentSuccess />} />

          {/* User Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/myorders" element={<MyOrders />} />
          <Route path="/order/:id" element={<OrderDetails />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/orders" element={<Orders />} />
          <Route path="/admin/users" element={<Users />} />
        </Routes>
        <Footer />
        <Toaster position="bottom-center" />
      </Router>
    </div>
  );
}

export default App;
