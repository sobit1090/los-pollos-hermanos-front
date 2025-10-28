import Home from "../components/home/Home";
import "../styles/app.scss";
import "../styles/header.scss";
import "../styles/footer.scss";
import "../styles/cart.scss";
 
import "../styles/orderDetails.scss";
import "../styles/profile.scss";
import "../styles/home.scss";
import "../styles/founder.scss";
import "../styles/menu.scss";
import "../styles/table.scss"
import "../styles/confirmOrder.scss"
import "../styles/paymentSuccess.scss"
import "../styles/shipping.scss";
import "../styles/footerDescription.scss";
import "../styles/ContactUs.scss";
import "../styles/services.scss";
import "../styles/dashboard.scss";
import "../styles/user.scss";
import "../styles/orders.scss";
import "../styles/about.scss";
import "../styles/menu_new.scss";
import "./App.css"
import "./index.css"
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import AuthContainer from "../components/Auth/AuthContainer";
import Contact from "../components/contact/ComplaintContactContainer"
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
import MenuNew from "../components/home/Menu_new"
 
function App() {
  return ( 
    <div className="sobit">
    
    <Router >
      <Header />
      <Routes>
        <Route path="/login" element={<AuthContainer />} />
        <Route path="/" element={<Home />} />
        <Route path="/contacts" element={<ComplaintContactContainer/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/service" element={<Services />} />
        <Route path="/shipping" element={<Shipping/>} />
        <Route path="/confirmOrder" element={<ConfirmOrder/>}/>
        <Route path="/CashOnDelivery" element={<PaymentSuccess/>}/>
        <Route path="/profile" element={<Profile/>} />
        <Route path="/myorders" element={<MyOrders/>}/>
        <Route path="/order/:id" element={<OrderDetails/>}/>
        <Route path="/admin/dashboard" element={<Dashboard/>}/>
        <Route path="/admin/orders" element={<Orders/>}/>
        <Route path="/admin/users" element={<Users/>}/>
         <Route path="/about" element={<About/>}/>
         <Route path="/NewMenu" element={<MenuNew/>}/>
      </Routes>
      <Footer />
    </Router></div>
  );
}

export default App;
